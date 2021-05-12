import { TileFactory } from "factories/TileFactory";
import { chunk } from "lodash";
import { makeAutoObservable } from "mobx";
import { ApplicationProcess } from "models/ApplicationProcess";
import { AuthEventType } from "models/auth/AuthEventType";
import { KeyboardEventType } from "models/hotkey/KeyboardEventType";
import { ProcessEventType } from "models/process/ProcessEventType";
import { TileEventType } from "models/tile/TileEventType";
import { TilePreset } from "models/tile/TilePreset";
import { UserDatabasePropKey } from "models/userDatabase/UserDatabasePropKey";
import { IVirtualViewportSnapshot } from "models/virtual/IVirtualViewportsSnapshot";
import { VirtualViewportEventType } from "models/virtual/VirtualViewportEventType";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import { ApplicationWindowEventType } from "models/window/ApplicationWindowEventType";
import { AppStore } from "stores/AppStore";

export class VirtualViewportManager {
    private store: AppStore;

    viewports: VirtualViewportModel[] = [];

    currentViewport: VirtualViewportModel;

    getIndexByViewport(viewport: VirtualViewportModel) {
        return this.viewports.indexOf(viewport);
    }

    constructor(store: AppStore) {
        this.store = store;

        const [initialViewport] = this.viewports;
        this.currentViewport = initialViewport;

        this.store.sharedEventBus.eventBus.add(
            ProcessEventType.OnInstantiateProcess,
            (appProcess: ApplicationProcess) =>
                this.onInstantiateProcess(appProcess),
        );

        this.store.sharedEventBus.eventBus.add(
            VirtualViewportEventType.OnRemoveViewportFrame,
            (viewport: VirtualViewportModel) =>
                this.onRemoveViewportFrame(viewport),
        );

        this.store.sharedEventBus.eventBus.add(
            TileEventType.OnChangePreset,
            (payload: { preset: TilePreset; viewport: VirtualViewportModel }) =>
                this.onChangePreset(payload.preset, payload.viewport),
        );

        this.store.sharedEventBus.eventBus.add(
            TileEventType.OnTileGridOverflow,
            (processes: ApplicationProcess[]) =>
                this.onTileGridOverflow(processes),
        );

        this.store.sharedEventBus.eventBus.add(
            TileEventType.OnTileViewportSpread,
            (payload: {
                chunks: ApplicationProcess[][];
                viewport: VirtualViewportModel;
            }) => this.onTileViewportSpread(payload.chunks, payload.viewport),
        );

        this.store.sharedEventBus.eventBus.add(
            ApplicationWindowEventType.OnFocusWindow,
            (appWindow: ApplicationWindow) => this.onFocusWindow(appWindow),
        );

        this.store.sharedEventBus.eventBus.add(
            KeyboardEventType.ArrowLeftWithControl,
            () => this.onKeyboardArrowLeftWithControl(),
        );

        this.store.sharedEventBus.eventBus.add(
            KeyboardEventType.ArrowRightWithControl,
            () => this.onKeyboardArrowRightWithControl(),
        );

        this.store.sharedEventBus.eventBus.add(
            VirtualViewportEventType.OnAddViewportFrame,
            () => this.onChangeViewportFrame(),
        );

        this.store.sharedEventBus.eventBus.add(
            VirtualViewportEventType.OnRemoveViewportFrame,
            () => this.onChangeViewportFrame(),
        );

        this.store.sharedEventBus.eventBus.add(AuthEventType.OnLogout, () =>
            this.onLogout(),
        );

        // this.store.sharedEventBus.eventBus.add(AuthEventType.OnLogin, () =>
        //     this.onLogin(),
        // );
        this.addViewport(new VirtualViewportModel());

        this.store.sharedEventBus.eventBus.add(
            TileEventType.OnChangePreset,
            () => this.saveUserViewports(),
        );

        makeAutoObservable(this);
    }

    setViewports(viewports: VirtualViewportModel[]) {
        this.viewports = viewports;
    }

    saveUserViewports() {
        const data = {
            [UserDatabasePropKey.Viewports]: {
                currentViewportId: this.currentViewport.id,
                activeTilePresetAlias: this.store.tile.defaultTileTemplate
                    .alias,
                viewports: this.viewports.map((item) => ({
                    viewportId: item.id,
                    templateAlias: item.tilePreset.alias,
                })),
            },
        };

        this.store.userDatabase.save<IVirtualViewportSnapshot>([
            {
                name: UserDatabasePropKey.Viewports,
                value: data[UserDatabasePropKey.Viewports],
            },
        ]);
    }

    onChangeViewportFrame() {
        this.saveUserViewports();
    }

    onLogout() {
        const viewport = new VirtualViewportModel({
            tilePreset: TileFactory.createTilePreset(
                this.store.tile.defaultTileTemplate,
            ),
        });

        this.setViewports([viewport]);
        this.setCurrentViewport(viewport);
    }

    onKeyboardArrowLeftWithControl() {
        const currentViewportIndex = this.viewports.findIndex(
            (item) => item.id === this.currentViewport.id,
        );
        if (currentViewportIndex - 1 >= 0) {
            this.setCurrentViewport(this.viewports[currentViewportIndex - 1]);
        }
    }

    onKeyboardArrowRightWithControl() {
        const currentViewportIndex = this.viewports.findIndex(
            (item) => item.id === this.currentViewport.id,
        );
        if (currentViewportIndex + 1 < this.viewports.length) {
            this.setCurrentViewport(this.viewports[currentViewportIndex + 1]);
        }
    }

    onChangePreset(preset: TilePreset, viewport: VirtualViewportModel) {
        const viewportProcesses = this.store.processManager.processes.filter(
            (item) => item.window.viewport.id === viewport.id,
        );

        if (viewportProcesses.length > preset.maxTilesCount) {
            const excessCount = viewportProcesses.length - preset.maxTilesCount;

            const startExcessIndex = viewportProcesses.length - excessCount;

            if (viewportProcesses.length > preset.maxTilesCount * 2) {
                const chunks = chunk(viewportProcesses, preset.maxTilesCount);

                this.store.sharedEventBus.eventBus.dispatch(
                    TileEventType.OnTileViewportSpread,
                    { chunks, viewport },
                );

                viewport.setTilePreset(preset);

                return;
            }

            const excessProcesses = viewportProcesses.slice(startExcessIndex);

            this.store.sharedEventBus.eventBus.dispatch(
                TileEventType.OnTileGridOverflow,
                excessProcesses,
            );
        }

        viewport.setTilePreset(preset);
    }

    onInstantiateProcess(process: ApplicationProcess) {
        process.window.setViewport(this.currentViewport);
    }

    onRemoveViewportFrame(viewport: VirtualViewportModel) {
        if (viewport.id === this.currentViewport.id) {
            const index = this.viewports.indexOf(viewport);
            if (index > 0) {
                const nearbyViewportFrame = this.viewports[index - 1];
                this.setCurrentViewport(nearbyViewportFrame);
            } else {
                const nearbyViewportFrame = this.viewports.find(
                    (item) => item.id !== viewport.id,
                );
                if (nearbyViewportFrame) {
                    this.setCurrentViewport(nearbyViewportFrame);
                }
            }
        }
    }

    onTileGridOverflow(processes: ApplicationProcess[]) {
        const current = this.currentViewport;

        const newViewport = new VirtualViewportModel();

        processes.forEach((appProcess) => {
            appProcess.window.setViewport(newViewport);
        });

        this.insertViewport(newViewport, current);
    }

    onTileViewportSpread(
        chunks: ApplicationProcess[][],
        viewport: VirtualViewportModel,
    ) {
        chunks.forEach((processesChunk) => {
            const newViewport = new VirtualViewportModel();
            processesChunk.forEach((appProcess) => {
                const appWindow = appProcess.window;

                appWindow.setArea("auto");

                appProcess.window.setViewport(newViewport);
            });
            this.insertViewport(newViewport, this.currentViewport);
        });
        this.removeViewport(viewport);
    }

    onFocusWindow(appWindow: ApplicationWindow) {
        this.setCurrentViewport(appWindow.viewport);
    }

    addViewport(viewport: VirtualViewportModel, preset?: TilePreset) {
        this.viewports.push(viewport);

        this.setCurrentViewport(viewport);

        this.store.sharedEventBus.eventBus.dispatch(
            VirtualViewportEventType.OnAddViewportFrame,
            viewport,
        );
    }

    insertViewport(
        viewport: VirtualViewportModel,
        insertAfterViewport: VirtualViewportModel,
    ) {
        const defaultTileTemplate = this.store.tile.defaultTileTemplate;

        const index = this.viewports.findIndex(
            (item) => insertAfterViewport.id === item.id,
        );

        this.viewports.splice(index + 1, 0, viewport);

        this.setCurrentViewport(viewport);

        viewport.setTilePreset(
            TileFactory.createTilePreset(defaultTileTemplate),
        );

        this.store.sharedEventBus.eventBus.dispatch(
            VirtualViewportEventType.OnAddViewportFrame,
            viewport,
        );
    }

    clearViewport(viewport: VirtualViewportModel) {
        this.store.sharedEventBus.eventBus.dispatch(
            VirtualViewportEventType.OnClearViewportFrame,
            viewport,
        );
    }

    removeViewport(viewport: VirtualViewportModel) {
        const index = this.viewports.indexOf(viewport);
        this.viewports.splice(index, 1);

        this.store.sharedEventBus.eventBus.dispatch(
            VirtualViewportEventType.OnRemoveViewportFrame,
            viewport,
        );
    }

    setCurrentViewport(viewport: VirtualViewportModel) {
        this.currentViewport = viewport;

        this.store.sharedEventBus.eventBus.dispatch(
            VirtualViewportEventType.OnChangeViewportFrame,
            viewport,
        );
    }
}
