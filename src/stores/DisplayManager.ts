import { makeAutoObservable } from "mobx";
import { DisplayMode } from "models/display/DisplayMode";
import { DisplayModeEventType } from "models/display/DisplayModeEventType";
import { DisplayModeType } from "models/display/DisplayModeType";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { registeredDisplayModes } from "registeredDisplayModes";
import { AppStore } from "stores/AppStore";

export class DisplayManager {
    private store: AppStore;

    // displayMode: DisplayMode;

    // setDisplayMode(displayMode: DisplayMode) {
    //     this.displayMode = displayMode;
    // }

    displayModes: DisplayMode[] = registeredDisplayModes;

    defaultDisplayMode: DisplayMode;

    applyDisplayModeToViewport(
        displayMode: DisplayMode,
        viewport: VirtualViewportModel,
    ) {
        viewport.setDisplayMode(displayMode);

        this.store.sharedEventBus.eventBus.dispatch(
            DisplayModeEventType.OnDisplayModeChange,
            displayMode,
        );
    }

    findDisplayModeByType(type: DisplayModeType) {
        return this.displayModes.find((item) => item.type === type);
    }

    constructor(store: AppStore) {
        this.store = store;

        const [initialDisplayMode] = registeredDisplayModes;

        this.defaultDisplayMode = initialDisplayMode;

        makeAutoObservable(this);
    }

    setDefaultDisplayMode(displayMode: DisplayMode) {
        this.defaultDisplayMode = displayMode;
    }
}
