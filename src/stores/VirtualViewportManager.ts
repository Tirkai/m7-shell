import { TileFactory } from "factories/TileFactory";
import { makeAutoObservable } from "mobx";
import { ApplicationProcess } from "models/ApplicationProcess";
import { AuthEventType } from "models/auth/AuthEventType";
import { KeyboardEventType } from "models/hotkey/KeyboardEventType";
import { TileEventType } from "models/tile/TileEventType";
import { TileTemplate } from "models/tile/TileTemplate";
import { VirtualViewportEventType } from "models/virtual/VirtualViewportEventType";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import { ApplicationWindowEventType } from "models/window/ApplicationWindowEventType";
import { AppStore } from "stores/AppStore";

export class VirtualViewportManager {
    private store: AppStore;

    viewports: VirtualViewportModel[] = [];

    currentViewport: VirtualViewportModel = new VirtualViewportModel();

    getIndexByViewport(viewport: VirtualViewportModel) {
        return this.viewports.indexOf(viewport);
    }

    constructor(store: AppStore) {
        this.store = store;

        // const [initialViewport] = this.viewports;
        // this.currentViewport = initialViewport;

        // this.store.sharedEventBus.eventBus.add(
        //     ProcessEventType.OnInstantiateProcess,
        //     (appProcess: ApplicationProcess) =>
        //         this.onInstantiateProcess(appProcess),
        // );

        this.store.sharedEventBus.eventBus.add(
            VirtualViewportEventType.OnRemoveViewportFrame,
            (viewport: VirtualViewportModel) =>
                this.onRemoveViewportFrame(viewport),
        );

        this.store.sharedEventBus.eventBus.add(
            TileEventType.OnChangePreset,
            (payload: {
                template: TileTemplate;
                viewport: VirtualViewportModel;
            }) => this.onChangePreset(payload.template, payload.viewport),
        );

        this.store.sharedEventBus.eventBus.add(
            TileEventType.OnTileViewportSplit,
            (excessProcesses: ApplicationProcess[]) =>
                this.onTileViewportSplit(excessProcesses),
        );

        this.store.sharedEventBus.eventBus.add(
            TileEventType.OnTileViewportOverflow,
            (excessProcess: ApplicationProcess) =>
                this.onTileViewportOverflow(excessProcess),
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
            KeyboardEventType.PlusWithControl,
            () => this.onKeyboardPlusWithControl(),
        );

        this.store.sharedEventBus.eventBus.add(AuthEventType.OnLogout, () =>
            this.onLogout(),
        );

        this.store.sharedEventBus.eventBus.add(AuthEventType.OnEntry, () => {
            this.init();
        });

        // this.init();

        makeAutoObservable(this);
    }

    init() {
        const initialViewport = new VirtualViewportModel({
            displayMode: this.store.display.defaultDisplayMode,
        });

        this.addViewport(initialViewport);
    }

    setViewports(viewports: VirtualViewportModel[]) {
        this.viewports = viewports;
    }

    onLogout() {
        // const viewport = new VirtualViewportModel({
        //     tilePreset: TileFactory.createTilePreset(
        //         this.store.tile.defaultTileTemplate,
        //     ),
        // });
        this.setViewports([]);
        // this.setCurrentViewport(viewport);
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

    onKeyboardPlusWithControl() {
        const viewport = new VirtualViewportModel();
        this.addViewport(viewport);
    }

    onChangePreset(template: TileTemplate, viewport: VirtualViewportModel) {
        const viewportProcesses = this.store.processManager.processes.filter(
            (item) => item.window.viewport.id === viewport.id,
        );

        const preset = TileFactory.createTilePreset(template);

        if (viewportProcesses.length > preset.maxTilesCount) {
            const excessCount = viewportProcesses.length - preset.maxTilesCount;
            const startExcessIndex = viewportProcesses.length - excessCount;
            const excessProcesses = viewportProcesses.slice(startExcessIndex);

            this.store.sharedEventBus.eventBus.dispatch(
                TileEventType.OnTileViewportSplit,
                excessProcesses,
            );
        }

        viewport.setTilePreset(preset);
    }

    applyViewportToWindow(
        viewport: VirtualViewportModel,
        appWindow: ApplicationWindow,
    ) {
        appWindow.setViewport(viewport);
    }

    onInstantiateProcess(process: ApplicationProcess) {
        // Из за этого метода я страдал 3 дня
        // this.applyViewportToWindow(this.currentViewport, process.window);
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

    onTileViewportSplit(excessProcesses: ApplicationProcess[]) {
        const currentViewport = this.currentViewport;

        const applyViewportToExcessesWindows = async (
            appWindows: ApplicationWindow[],
        ) =>
            new Promise<VirtualViewportModel>((resolve) => {
                const newViewport = new VirtualViewportModel({
                    displayMode: this.store.display.defaultDisplayMode,
                });

                appWindows.forEach((appWindow) => {
                    this.applyViewportToWindow(newViewport, appWindow);
                });
                resolve(newViewport);
            });

        applyViewportToExcessesWindows(
            excessProcesses.map((item) => item.window),
        ).then((newViewport) => {
            this.insertViewport(newViewport, currentViewport);
        });
        // setTimeout(() => {
        //     this.insertViewport(newViewport, currentViewport);
        // });

        // this.addViewport(newViewport);
        // this.viewports.push(newViewport);

        // this.setCurrentViewport(newViewport);
    }

    onTileViewportOverflow(excessProcess: ApplicationProcess) {
        const newViewport = new VirtualViewportModel({
            displayMode: this.store.display.defaultDisplayMode,
        });
        this.insertViewport(newViewport, this.currentViewport);
        this.applyViewportToWindow(newViewport, excessProcess.window);
    }

    onTileViewportSpread(
        chunks: ApplicationProcess[][],
        viewport: VirtualViewportModel,
    ) {
        chunks.forEach((processesChunk) => {
            const newViewport = new VirtualViewportModel({
                displayMode: this.store.display.defaultDisplayMode,
            });
            processesChunk.forEach((appProcess) => {
                const appWindow = appProcess.window;

                appWindow.setArea("auto");

                this.applyViewportToWindow(newViewport, appProcess.window);
            });
            this.insertViewport(newViewport, this.currentViewport);
        });
        this.removeViewport(viewport);
    }

    onFocusWindow(appWindow: ApplicationWindow) {
        this.setCurrentViewport(appWindow.viewport);
    }

    addViewport(viewport: VirtualViewportModel) {
        this.viewports.push(viewport);
        // /!!!
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
