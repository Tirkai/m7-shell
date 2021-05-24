import { JsonRpcFailure, JsonRpcSuccess } from "@algont/m7-utils";
import { TileFactory } from "factories/TileFactory";
import { isEmpty } from "lodash";
import { makeAutoObservable } from "mobx";
import { ApplicationEventType } from "models/app/ApplicationEventType";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { AuthEventType } from "models/auth/AuthEventType";
import { DisplayModeType } from "models/display/DisplayModeType";
import { ExternalApplication } from "models/ExternalApplication";
import { IProcessesSnapshot } from "models/process/IProcessesSnapshot";
import { ProcessEventType } from "models/process/ProcessEventType";
import { ISessionRecovery } from "models/recovery/ISessionRecovery";
import { RecoveryEventType } from "models/recovery/RecoveryEventType";
import { TileEventType } from "models/tile/TileEventType";
import { UserDatabasePropKey } from "models/userDatabase/UserDatabasePropKey";
import { IVirtualViewportSnapshot } from "models/virtual/IVirtualViewportsSnapshot";
import { VirtualViewportEventType } from "models/virtual/VirtualViewportEventType";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { AppStore } from "stores/AppStore";

interface IUserSessionSnapshot {
    [key: string]: ISessionRecovery;
}

export class RecoveryStore {
    private store: AppStore;

    dynamicSessionSnapshot: ISessionRecovery | null = null;
    freezedSessionSnapshot: ISessionRecovery | null = null;

    isDisplayRecoveryDialog: boolean = false;

    isSnapshotInitialized: boolean = false;

    constructor(store: AppStore) {
        this.store = store;
        makeAutoObservable(this);

        const { eventBus } = this.store.sharedEventBus;

        eventBus.add(TileEventType.OnChangePreset, () => {
            this.saveSnapshot(UserDatabasePropKey.DynamicSession);
        });

        eventBus.add(ApplicationEventType.OnApplicationListLoaded, () => {
            this.onApplicationListLoaded();
        });

        eventBus.add(VirtualViewportEventType.OnSelectViewportFrame, () => {
            this.saveSnapshot(UserDatabasePropKey.DynamicSession);
        });

        eventBus.add(ProcessEventType.OnChangeProcess, () => {
            this.saveSnapshot(UserDatabasePropKey.DynamicSession);
        });

        eventBus.add(AuthEventType.OnLogout, () => {
            this.onLogout();
        });
    }

    onLogout() {
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
                dynamicResponse.result,
            );
            this.startRecovery(freezedResponse.result);
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
            viewports: this.store.virtualViewport.viewports.map((item) => ({
                viewportId: item.id,
                templateAlias: item.tilePreset?.alias ?? "1x1",
                // TODO: Remove default display mode
                displayModeType: item.displayMode?.type ?? DisplayModeType.Tile,
                index: item.index,
            })),
        };

        return snapshot;
    }

    createProcessesSnapshot() {
        const snapshot: IProcessesSnapshot = {
            hasActiveSession: !!this.store.processManager.processes.length,
            processes: this.store.processManager.processes.map((item) => ({
                // TODO Think about this
                app: item.app as ExternalApplication,
                url: item.url,
                name: item.name,
                viewportId: item.window.viewport.id,
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
        this.store.virtualViewport.setViewports([]);
        this.store.processManager.destroyAllProcesses();

        await this.recoveryViewports(snapshot.viewportSnapshot);
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

                runner.run(app, { viewport });
            });
            resolve({});
        });
    }

    async recoveryViewports(snapshot: IVirtualViewportSnapshot) {
        return new Promise((resolve) => {
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

            const [first] = viewports;
            this.store.virtualViewport.setViewports(viewports);

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
