import { TileFactory } from "factories/TileFactory";
import { isEmpty } from "lodash";
import { makeAutoObservable } from "mobx";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { ExternalApplication } from "models/ExternalApplication";
import { IApplicationProcess } from "models/process/IApplicationProcess";
import { IProcessesSnapshot } from "models/process/IProcessesSnapshot";
import { UserDatabasePropKey } from "models/userDatabase/UserDatabasePropKey";
import { IVirtualViewportSnapshot } from "models/virtual/IVirtualViewportsSnapshot";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { AppStore } from "stores/AppStore";

interface IUserSessionSnapshot {
    [UserDatabasePropKey.Processes]: IProcessesSnapshot;
    [UserDatabasePropKey.Viewports]: IVirtualViewportSnapshot;
}

export class RecoveryStore {
    private store: AppStore;

    processesSnapshot: IProcessesSnapshot | null = null;
    viewportsSnapshot: IVirtualViewportSnapshot | null = null;

    isDisplayRecoveryDialog: boolean = false;

    constructor(store: AppStore) {
        this.store = store;
        makeAutoObservable(this);
    }

    setDisplayRecoveryDialog(value: boolean) {
        this.isDisplayRecoveryDialog = value;
    }

    setProcessesSnapshot(snapshot: IProcessesSnapshot) {
        this.processesSnapshot = snapshot;
    }

    setViewportsSnapshot(snapshot: IVirtualViewportSnapshot) {
        this.viewportsSnapshot = snapshot;
    }

    async startRecovery() {
        if (this.viewportsSnapshot?.viewports) {
            const snapshot = this.viewportsSnapshot;
            await this.recoveryViewports(snapshot);
        }

        if (this.processesSnapshot?.processes) {
            await this.recoveryProcesses(this.processesSnapshot.processes);
        }
    }

    async fetchLastUserSession() {
        try {
            const processesPropKey = UserDatabasePropKey.Processes;
            const viewportsPropKey = UserDatabasePropKey.Viewports;

            const { result } = await this.store.userDatabase.load<
                IUserSessionSnapshot
            >([processesPropKey, viewportsPropKey]);

            if (result && !isEmpty(result)) {
                this.setDisplayRecoveryDialog(true);

                const processesSnapshot = result[processesPropKey];
                const viewportsSnapshot = result[viewportsPropKey];

                this.setProcessesSnapshot(processesSnapshot);
                this.setViewportsSnapshot(viewportsSnapshot);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async recoveryProcesses(recoveryData: IApplicationProcess[]) {
        return new Promise((resolve) => {
            const runner = new ApplicationRunner(this.store);

            recoveryData.forEach((item) => {
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

                const viewport = new VirtualViewportModel({
                    id: item.viewportId,
                    displayMode: this.store.display.defaultDisplayMode,
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
            resolve({});
        });
    }
}
