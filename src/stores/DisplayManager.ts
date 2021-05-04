import { makeAutoObservable } from "mobx";
import { DisplayMode } from "models/display/DisplayMode";
import { TileWindowStrategy } from "models/window/TileWindowStrategy";
import { AppStore } from "stores/AppStore";

export class DisplayManager {
    private store: AppStore;

    displayMode: DisplayMode;

    setDisplayMode(displayMode: DisplayMode) {
        this.displayMode = displayMode;
    }

    constructor(store: AppStore) {
        this.store = store;

        // this.displayMode = new DisplayMode({
        //     windowStrategy: new FloatWindowStrategy(this.store),
        // });

        this.displayMode = new DisplayMode({
            windowStrategy: new TileWindowStrategy(this.store),
        });

        makeAutoObservable(this);
    }
}
