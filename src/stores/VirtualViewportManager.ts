import { makeAutoObservable } from "mobx";
import { ApplicationProcess } from "models/ApplicationProcess";
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

    viewports: VirtualViewportModel[] = [
        new VirtualViewportModel({ index: 0 }),
    ];

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

        makeAutoObservable(this);
    }

    onChangePreset(preset: TilePreset) {
        this.currentViewport.setTilePreset(preset);
    }

    onInstantiateProcess(process: ApplicationProcess) {
        process.setViewport(this.currentViewport);
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
        const current = this.currentViewport;

        const newViewport = new VirtualViewportModel();

        appProcess.setViewport(newViewport);

        this.insertViewport(newViewport, current);

        // this.addViewport(newViewport);
    }

    onFocusWindow(appWindow: ApplicationWindow) {
        // TODO: think about it
        const findedProcess = this.store.processManager.processes.find(
            (process) => process.window.id === appWindow.id,
        );

        if (findedProcess) {
            const viewport = findedProcess.viewport;
            if (viewport) {
                this.setCurrentViewport(viewport);
            }
        }
    }

    addViewport(viewport: VirtualViewportModel, preset?: TilePreset) {
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

        this.store.sharedEventBus.eventBus.dispatch(
            VirtualViewportEventType.OnAddViewportFrame,
            viewport,
        );
    }

    insertViewport(
        viewport: VirtualViewportModel,
        insertAfterViewport: VirtualViewportModel,
    ) {
        const index = this.viewports.findIndex(
            (item) => insertAfterViewport.id === item.id,
        );

        this.viewports.splice(index + 1, 0, viewport);

        this.setCurrentViewport(viewport);

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
