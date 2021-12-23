import { JsonRpcFailure, JsonRpcSuccess } from "@algont/m7-utils";
import { DEFAULT_TILE_PRESET_ALIAS } from "constants/config";
import { TileFactory } from "factories/TileFactory";
import { isEmpty } from "lodash";
import { makeAutoObservable } from "mobx";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { ExternalApplication } from "models/app/ExternalApplication";
import { AuthEventType } from "models/auth/AuthEventType";
import { DisplayModeType } from "models/display/DisplayModeType";
import { IProcessesSnapshot } from "models/process/IProcessesSnapshot";
import { ISnapshotApplicationProcess } from "models/process/ISnapshotApplicationProcess";
import { ISessionRecovery } from "models/recovery/ISessionRecovery";
import { RecoveryEventType } from "models/recovery/RecoveryEventType";
import { UserDatabasePropKey } from "models/userDatabase/UserDatabasePropKey";
import { IVirtualViewportSnapshot } from "models/virtual/IVirtualViewportsSnapshot";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { AppStore } from "stores/AppStore";

interface IUserSessionSnapshot {
    [key: string]: ISessionRecovery;
}

export class RecoveryStore {
    private store: AppStore;

    interval: NodeJS.Timeout | null = null;

    dynamicSessionSnapshot: ISessionRecovery | null = null;
    lastSnapshot: ISessionRecovery | null = null;
    freezedSessionSnapshot: ISessionRecovery | null = null;

    isSnapshotInitialized: boolean = false;

    constructor(store: AppStore) {
        this.store = store;
        makeAutoObservable(this);

        const { eventBus } = this.store.sharedEventBus;

        eventBus.add(AuthEventType.OnEntry, () => {
            this.onEntry();
        });

        eventBus.add(AuthEventType.OnLogout, () => {
            this.onLogout();
        });
    }

    async saveDynamicSnapshot() {
        const processSnapshot = this.createProcessesSnapshot();
        const viewportSnapshot = this.createViewportSnapshot();

        const snapshot: ISessionRecovery = {
            processSnapshot,
            viewportSnapshot,
        };

        const stringifiedCurrentSnapshot = JSON.stringify(snapshot);
        const stringifiedLastSnapshot = JSON.stringify(this.lastSnapshot);

        if (stringifiedCurrentSnapshot !== stringifiedLastSnapshot) {
            this.setLastSnapshot(snapshot);

            await this.store.userDatabase.save<ISessionRecovery>([
                {
                    name: UserDatabasePropKey.DynamicSession,
                    value: snapshot,
                },
            ]);
        }
    }

    async saveFreezeSnapshot() {
        const processSnapshot = this.createProcessesSnapshot();
        const viewportSnapshot = this.createViewportSnapshot();

        const snapshot: ISessionRecovery = {
            processSnapshot,
            viewportSnapshot,
        };

        await this.store.userDatabase.save<ISessionRecovery>([
            {
                name: UserDatabasePropKey.FreezedSession,
                value: snapshot,
            },
        ]);
    }

    onEntry() {
        // TODO: Move to component
        if (!this.store.config.config.properties.kiosk.enabled) {
            this.interval = setInterval(() => {
                this.saveDynamicSnapshot();
            }, 3000);

            this.loadSnapshots();
        }
    }

    onLogout() {
        if (this.interval) {
            clearInterval(this.interval);
        }

        this.setFreezedSessionSnapshot(null);
        this.setDynamicSessionSnapshot(null);
    }

    onApplicationListLoaded() {
        this.loadSnapshots();
    }

    async loadSnapshots() {
        const freezedResponse = await this.loadSnapshot(
            UserDatabasePropKey.FreezedSession,
        );

        const dynamicResponse = await this.loadSnapshot(
            UserDatabasePropKey.DynamicSession,
        );

        if (dynamicResponse.status && dynamicResponse.result) {
            this.store.sharedEventBus.eventBus.dispatch(
                RecoveryEventType.OnDynamicSnapshotLoaded,
                dynamicResponse.result,
            );

            this.setDynamicSessionSnapshot(dynamicResponse.result);
        }

        if (freezedResponse.status && freezedResponse.result) {
            this.store.sharedEventBus.eventBus.dispatch(
                RecoveryEventType.OnFreezedSnapshotLoaded,
                freezedResponse.result,
            );

            this.startRecovery(freezedResponse.result);
            this.setFreezedSessionSnapshot(freezedResponse.result);
        }

        this.isSnapshotInitialized = true;

        this.store.sharedEventBus.eventBus.dispatch(
            RecoveryEventType.OnAnySnapshotLoaded,
            dynamicResponse.result,
        );
    }

    get isSnapshotsReady() {
        return (
            this.freezedSessionSnapshot !== null &&
            this.dynamicSessionSnapshot !== null
        );
    }

    createViewportSnapshot() {
        const snapshot: IVirtualViewportSnapshot = {
            currentViewportId: this.store.virtualViewport.currentViewport.id,
            activeTilePresetAlias: this.store.tile.defaultTileTemplate.alias,
            viewports: this.store.virtualViewport.viewports
                .filter((item) => item.state.savable)
                .map((item) => ({
                    viewportId: item.id,
                    templateAlias:
                        item.tilePreset?.alias ?? DEFAULT_TILE_PRESET_ALIAS,
                    // TODO: Remove default display mode
                    displayModeType:
                        item.displayMode?.type ?? DisplayModeType.Tile,
                    index: item.index,
                })),
        };

        return snapshot;
    }

    createProcessesSnapshot() {
        const snapshot: IProcessesSnapshot = {
            hasActiveSession: !!this.store.processManager.processes.length,
            processes: this.store.processManager.processes
                .filter((item) => item.state.savable)
                .map((item) => {
                    const snapshot: ISnapshotApplicationProcess = {
                        // TODO Think about this
                        app: item.app as ExternalApplication,
                        process: {
                            name: item.name,
                            url:
                                item.lockedUrl.length > 0
                                    ? item.lockedUrl
                                    : item.url,
                        },
                        window: {
                            type: item.window.type,
                            position: { x: item.window.x, y: item.window.y },
                            area: item.window.area,
                            size: {
                                width: item.window.width,
                                height: item.window.height,
                            },
                        },
                        viewport: {
                            viewportId: item.window.viewport.id,
                        },
                    };

                    return snapshot;
                }),
        };
        return snapshot;
    }

    setFreezedSessionSnapshot(snapshot: ISessionRecovery | null) {
        this.freezedSessionSnapshot = snapshot;
    }

    setDynamicSessionSnapshot(snapshot: ISessionRecovery | null) {
        this.dynamicSessionSnapshot = snapshot;
    }

    async loadSnapshot(propKey: UserDatabasePropKey) {
        const { result } =
            await this.store.userDatabase.load<IUserSessionSnapshot>([propKey]);

        if (result && !isEmpty(result)) {
            return new JsonRpcSuccess(result[propKey]);
        }
        return new JsonRpcFailure();
    }

    async startRecovery(snapshot: ISessionRecovery) {
        this.store.processManager.resetProcesses();

        if (snapshot.viewportSnapshot.viewports.length > 0) {
            this.store.virtualViewport.resetViewports();
            await this.recoveryViewports(snapshot.viewportSnapshot);
        }

        await this.recoveryProcesses(snapshot.processSnapshot);
    }

    async fetchLastUserSession() {
        //
    }

    async recoveryProcesses(snapshot: IProcessesSnapshot) {
        return new Promise((resolve, reject) => {
            try {
                const runner = new ApplicationRunner(this.store);

                snapshot.processes.forEach((item) => {
                    const app =
                        this.store.applicationManager.findById(item.app.id) ??
                        new ExternalApplication({
                            ...item.app,
                        });

                    const viewport = this.store.virtualViewport.viewports.find(
                        (v) => v.id === item.viewport.viewportId,
                    );

                    if (viewport) {
                        runner.run(app, {
                            processOptions: {
                                url: item.process.url,
                            },
                            windowOptions: {
                                type: item.window.type,
                                viewport,
                                area: item.window.area,
                                x: item.window.position.x,
                                y: item.window.position.y,
                                width: item.window.size.width,
                                height: item.window.size.height,
                            },
                        });
                    }
                });
                resolve({});
            } catch (e) {
                console.log(e);
                reject({});
            }
        });
    }

    async recoveryViewports(snapshot: IVirtualViewportSnapshot) {
        return new Promise((resolve) => {
            if (snapshot.viewports.length <= 0) {
                resolve({});
                return;
            }

            const viewports = snapshot.viewports.map((item) => {
                const template =
                    this.store.tile.templates.find(
                        (tmp) => tmp.alias === item.templateAlias,
                    ) ?? this.store.tile.defaultTileTemplate;

                const preset = TileFactory.createTilePreset(template);
                const displayMode =
                    this.store.display.findDisplayModeByType(
                        item.displayModeType ?? DisplayModeType.Tile,
                    ) ?? this.store.display.defaultDisplayMode;

                const viewport = new VirtualViewportModel({
                    id: item.viewportId,
                    displayMode,
                    index: item.index,
                });

                viewport.setTilePreset(preset);

                return viewport;
            });

            const defaultTileTemplate = this.store.tile.templates.find(
                (item) => item.alias === snapshot.activeTilePresetAlias,
            );

            if (defaultTileTemplate) {
                this.store.tile.setDefaultTileTemplate(defaultTileTemplate);
            }

            const [first] = this.store.virtualViewport.viewports;
            this.store.virtualViewport.addViewports(viewports);

            const currentViewport = this.store.virtualViewport.viewports.find(
                (item) => item.id === snapshot.currentViewportId,
            );
            if (currentViewport) {
                this.store.virtualViewport.setCurrentViewport(currentViewport);
            } else {
                this.store.virtualViewport.setCurrentViewport(first);
            }
            resolve({});
        });
    }

    setLastSnapshot(snapshot: ISessionRecovery) {
        this.lastSnapshot = snapshot;
    }
}
