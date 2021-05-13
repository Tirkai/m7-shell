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

        // this.displayMode = new DisplayMode({
        //     windowStrategy: new FloatWindowStrategy(this.store),
        // });

        // this.displayMode = new DisplayMode({
        //     windowStrategy: new TileWindowStrategy(),
        //     enableTiles: true,
        // });

        makeAutoObservable(this);
    }
}
