import { makeAutoObservable } from "mobx";
import { ApplicationProcess } from "models/ApplicationProcess";
import { ProcessEventType } from "models/process/ProcessEventType";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { AppStore } from "stores/AppStore";

export class VirtualViewportManager {
    private store: AppStore;

    viewportIndex: number = 0;

    viewports: VirtualViewportModel[] = [
        new VirtualViewportModel({ index: 0 }),
    ];

    currentViewport: VirtualViewportModel;

    setViewportIndex(index: number) {
        this.viewportIndex = index;
    }

    getIndexByViewport(viewport: VirtualViewportModel) {
        return this.viewports.indexOf(viewport);
    }

    constructor(store: AppStore) {
        this.store = store;

        const [initialViewport] = this.viewports;
        this.currentViewport = initialViewport;

        this.store.sharedEventBus.eventBus.add(
            ProcessEventType.StartProcess,
            (appProcess: ApplicationProcess) => {
                appProcess.setViewport(this.currentViewport);
            },
        );

        makeAutoObservable(this);
    }

    addViewport(viewport: VirtualViewportModel) {
        this.viewports.push(viewport);
    }

    removeViewport(viewport: VirtualViewportModel) {
        const index = this.viewports.indexOf(viewport);
        this.viewports.splice(index, 1);
    }

    setCurrentViewport(viewport: VirtualViewportModel) {
        this.currentViewport = viewport;
    }
}
