import { TileFactory } from "factories/TileFactory";
import { makeAutoObservable } from "mobx";
import { ApplicationProcess } from "models/ApplicationProcess";
import { KeyboardEventType } from "models/hotkey/KeyboardEventType";
import { ProcessEventType } from "models/process/ProcessEventType";
import { TileEventType } from "models/tile/TileEventType";
import { TilePreset } from "models/tile/TilePreset";
import { VirtualViewportEventType } from "models/virtual/VirtualViewportEventType";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import { ApplicationWindowEventType } from "models/window/ApplicationWindowEventType";
import { AppStore } from "stores/AppStore";

export class VirtualViewportManager {
    private store: AppStore;

    viewports: VirtualViewportModel[] = [new VirtualViewportModel()];

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
            (preset: TilePreset) => this.onChangePreset(preset),
        );

        this.store.sharedEventBus.eventBus.add(
            TileEventType.OnTileGridOverflow,
            (process: ApplicationProcess) => this.onTileGridOverflow(process),
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

        makeAutoObservable(this);
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

    onChangePreset(preset: TilePreset) {
        this.currentViewport.setTilePreset(preset);
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

    onTileGridOverflow(appProcess: ApplicationProcess) {
        const defaultTileTemplate = this.store.tile.defaultTileTemplate;

        const current = this.currentViewport;

        const newViewport = new VirtualViewportModel();

        appProcess.window.setViewport(newViewport);

        this.insertViewport(newViewport, current);
    }

    onFocusWindow(appWindow: ApplicationWindow) {
        this.setCurrentViewport(appWindow.viewport);
    }

    addViewport(viewport: VirtualViewportModel, preset?: TilePreset) {
        const defaultTileTemplate = this.store.tile.defaultTileTemplate;

        this.viewports.push(viewport);

        this.setCurrentViewport(viewport);

        // if (preset) {
        //     const p = this.store.tile.presets.find(
        //         (item) => item.alias === preset.alias,
        //     );
        //     if (p) {
        //         viewport.setTilePreset(TileFactory.createTilePreset(p));
        //     }
        // }

        // viewport.setTilePreset(
        //     TileFactory.createTilePreset(defaultTileTemplate),
        // );

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

        // TODO: Think about it
        setTimeout(() => {
            // this.store.tile.applyPreset(defaultTileTemplate);
            viewport.setTilePreset(
                TileFactory.createTilePreset(defaultTileTemplate),
            );
        }, 500);

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
        this.store.sharedEventBus.eventBus.dispatch(
            VirtualViewportEventType.OnRemoveViewportFrame,
            viewport,
        );

        const index = this.viewports.indexOf(viewport);
        this.viewports.splice(index, 1);
    }

    setCurrentViewport(viewport: VirtualViewportModel) {
        this.currentViewport = viewport;

        this.store.sharedEventBus.eventBus.dispatch(
            VirtualViewportEventType.OnChangeViewportFrame,
            viewport,
        );
    }
}
