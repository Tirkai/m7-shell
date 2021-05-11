import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { AppStore } from "stores/AppStore";
import { IWindowInstantiateStrategy } from "./IWindowInstantiateStrategy";
import { TileWindowModel } from "./TileWindowModel";

export class TileWindowStrategy implements IWindowInstantiateStrategy {
    store: AppStore;

    constructor(store: AppStore) {
        this.store = store;
    }

    instantiate(viewport: VirtualViewportModel) {
        return new TileWindowModel({
            viewport,
        });
    }
}
