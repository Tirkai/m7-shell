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
import { OffsetDirection } from "types/OffsetDirection";

interface IEmptyViewportFrameEventPayload {
    viewport: VirtualViewportModel;
    direction: OffsetDirection;
}

export class VirtualViewportManager {
    private store: AppStore;

    viewports: VirtualViewportModel[] = [];

    currentViewport: VirtualViewportModel = new VirtualViewportModel();

    getIndexByViewport(viewport: VirtualViewportModel) {
        return this.viewports.indexOf(viewport);
    }

    constructor(store: AppStore) {
        this.store = store;

        const subscribes = [
            {
                type: VirtualViewportEventType.OnRemoveViewportFrame,
                handler: (viewport: VirtualViewportModel) =>
                    this.onRemoveViewportFrame(viewport),
            },
            {
                type: VirtualViewportEventType.OnRemoveViewportFrame,
                handler: (viewport: VirtualViewportModel) =>
                    this.onRemoveViewportFrame(viewport),
            },
            {
                type: TileEventType.OnChangePreset,
                handler: (payload: {
                    template: TileTemplate;
                    viewport: VirtualViewportModel;
                }) => this.onChangePreset(payload.template, payload.viewport),
            },
            {
                type: TileEventType.OnTileViewportSplit,
                handler: (excessProcesses: ApplicationProcess[]) =>
                    this.onTileViewportSplit(excessProcesses),
            },
            {
                type: TileEventType.OnTileViewportOverflow,
                handler: (excessProcess: ApplicationProcess) =>
                    this.onTileViewportOverflow(excessProcess),
            },
            {
                type: TileEventType.OnTileViewportSpread,
                handler: (payload: {
                    chunks: ApplicationProcess[][];
                    viewport: VirtualViewportModel;
                }) =>
                    this.onTileViewportSpread(payload.chunks, payload.viewport),
            },
            {
                type: ApplicationWindowEventType.OnFocusWindow,
                handler: (appWindow: ApplicationWindow) =>
                    this.onFocusWindow(appWindow),
            },
            {
                type: VirtualViewportEventType.OnAddViewportFrame,
                handler: (viewport: VirtualViewportModel) =>
                    this.onChangeViewport(viewport),
            },
            {
                type: VirtualViewportEventType.OnRemoveViewportFrame,
                handler: (viewport: VirtualViewportModel) =>
                    this.onChangeViewport(viewport),
            },
            {
                type: KeyboardEventType.ArrowLeftWithControl,
                handler: () => this.onKeyboardArrowLeftWithControl(),
            },
            {
                type: KeyboardEventType.ArrowRightWithControl,
                handler: () => this.onKeyboardArrowRightWithControl(),
            },
            {
                type: KeyboardEventType.PlusWithControl,
                handler: () => this.onKeyboardPlusWithControl(),
            },
            {
                type: AuthEventType.OnLogout,
                handler: () => this.onLogout(),
            },
            {
                type: AuthEventType.OnEntry,
                handler: () => this.init(),
            },
            {
                type: VirtualViewportEventType.OnEmptyViewportFrame,
                handler: (payload: IEmptyViewportFrameEventPayload) =>
                    this.onEmptyViewport(payload.viewport, payload.direction),
            },
        ];

        subscribes.forEach((item) =>
            this.store.sharedEventBus.eventBus.add<any>(
                item.type,
                item.handler,
            ),
        );

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

    clearViewports() {
        this.setViewports([]);
    }

    onLogout() {
        this.setViewports([]);
    }

    onEmptyViewport(
        viewport: VirtualViewportModel,
        direction: OffsetDirection,
    ) {
        const viewportIndex = this.viewports.indexOf(viewport);

        let targetViewport: VirtualViewportModel | null = null;

        // Check that viewport is exist
        if (viewportIndex > -1) {
            // Check this viewport is not the first on the list
            if (viewportIndex > 0) {
                targetViewport = this.viewports[viewportIndex + direction];
            } else {
                const nextViewport = this.viewports[viewportIndex - direction];
                if (nextViewport) {
                    targetViewport = nextViewport;
                }
            }

            if (targetViewport) {
                this.setCurrentViewport(targetViewport);
            }

            if (this.viewports.length > 1) {
                this.removeViewport(viewport);
            }
        }
    }

    onChangeViewport(viewport: VirtualViewportModel) {
        this.viewports.forEach((item, index) => {
            item.setIndex(index);
        });
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

        alert(index);

        this.store.sharedEventBus.eventBus.dispatch(
            VirtualViewportEventType.OnRemoveViewportFrame,
            viewport,
        );
    }

    setCurrentViewport(viewport: VirtualViewportModel) {
        this.currentViewport = viewport;

        this.store.sharedEventBus.eventBus.dispatch(
            VirtualViewportEventType.OnSelectViewportFrame,
            viewport,
        );
    }
}
