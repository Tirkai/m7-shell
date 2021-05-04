import { AppStore } from "stores/AppStore";
import { IWindowInstantiateStrategy } from "./IWindowInstantiateStrategy";
import { TileWindowModel } from "./TileWindowModel";

export class TileWindowStrategy implements IWindowInstantiateStrategy {
    store: AppStore;

    constructor(store: AppStore) {
        this.store = store;
    }

    instantiate() {
        return new TileWindowModel({
            viewport: this.store.virtualViewport.currentViewport,
        });
    }
}
