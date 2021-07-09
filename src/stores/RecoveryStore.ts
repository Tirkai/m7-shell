import { JsonRpcFailure, JsonRpcSuccess } from "@algont/m7-utils";
import { TileFactory } from "factories/TileFactory";
import { isEmpty } from "lodash";
import { makeAutoObservable } from "mobx";
import { ApplicationEventType } from "models/app/ApplicationEventType";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { ExternalApplication } from "models/app/ExternalApplication";
import { AuthEventType } from "models/auth/AuthEventType";
import { DisplayModeType } from "models/display/DisplayModeType";
import { IProcessesSnapshot } from "models/process/IProcessesSnapshot";
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
    freezedSessionSnapshot: ISessionRecovery | null = null;

    isDisplayRecoveryDialog: boolean = false;

    isSnapshotInitialized: boolean = false;

    constructor(store: AppStore) {
        this.store = store;
        makeAutoObservable(this);

        const { eventBus } = this.store.sharedEventBus;

        eventBus.add(ApplicationEventType.OnApplicationListLoaded, () => {
            this.onApplicationListLoaded();
        });

        eventBus.add(AuthEventType.OnLogout, () => {
            this.onLogout();
        });
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

        if (
            dynamicResponse.status &&
            dynamicResponse.result?.processSnapshot.hasActiveSession
        ) {
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
                    templateAlias: item.tilePreset?.alias ?? "1x1",
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
                .map((item) => ({
                    // TODO Think about this
                    app: item.app as ExternalApplication,
                    url: item.url,
                    name: item.name,
                    type: item.window.type,
                    viewportId: item.window.viewport.id,
                    position: { x: item.window.x, y: item.window.y },
                    area: item.window.area,
                })),
        };
        return snapshot;
    }

    setFreezedSessionSnapshot(snapshot: ISessionRecovery | null) {
        this.freezedSessionSnapshot = snapshot;
    }

    setDynamicSessionSnapshot(snapshot: ISessionRecovery | null) {
        this.dynamicSessionSnapshot = snapshot;
    }

    async saveSnapshot(propKey: UserDatabasePropKey) {
        if (this.isSnapshotInitialized) {
            const processSnapshot = this.createProcessesSnapshot();
            const viewportSnapshot = this.createViewportSnapshot();

            const freezedSnapshot: ISessionRecovery = {
                processSnapshot,
                viewportSnapshot,
            };

            await this.store.userDatabase.save<ISessionRecovery>([
                {
                    name: propKey,
                    value: freezedSnapshot,
                },
            ]);

            this.setFreezedSessionSnapshot(freezedSnapshot);
        }
    }

    async loadSnapshot(propKey: UserDatabasePropKey) {
        const { result } = await this.store.userDatabase.load<
            IUserSessionSnapshot
        >([propKey]);

        if (result && !isEmpty(result)) {
            return new JsonRpcSuccess(result[propKey]);
        }
        return new JsonRpcFailure();
    }

    setDisplayRecoveryDialog(value: boolean) {
        this.isDisplayRecoveryDialog = value;
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
        return new Promise((resolve) => {
            const runner = new ApplicationRunner(this.store);

            snapshot.processes.forEach((item) => {
                const app =
                    this.store.applicationManager.findById(item.app.id) ??
                    new ExternalApplication({
                        ...item.app,
                    });

                const viewport = this.store.virtualViewport.viewports.find(
                    (v) => v.id === item.viewportId,
                );

                if (viewport) {
                    runner.run(app, {
                        windowOptions: {
                            type: item.type,
                            viewport,
                            area: item.area,
                            x: item.position.x,
                            y: item.position.y,
                        },
                    });
                }
            });
            resolve({});
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
            setTimeout(() => {
                resolve({});
            }, 1000);
        });
    }
}
