import { makeAutoObservable } from "mobx";
import { TilePreset } from "models/tile/TilePreset";
import { registeredTilePresets } from "registeredTilePresets";
import { AppStore } from "stores/AppStore";

export class TileManager {
    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;
        makeAutoObservable(this);

        this.presets = registeredTilePresets;
    }

    presets: TilePreset[] = [];

    activePreset: TilePreset | null = null;

    applyPreset(preset: TilePreset) {
        this.activePreset = preset;
    }

    resetPreset() {
        this.activePreset = null;
    }
}
