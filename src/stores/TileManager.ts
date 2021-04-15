import { makeAutoObservable } from "mobx";
import { TileArea } from "models/tile/TileArea";
import { TilePreset } from "models/tile/TilePreset";
import { AppStore } from "stores/AppStore";

export class TileManager {
    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;
        makeAutoObservable(this);
    }

    presets: TilePreset[] = [];

    tiles: TileArea[] = [];
}
