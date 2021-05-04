import { AppStore } from "stores/AppStore";
import { ApplicationWindow } from "./ApplicationWindow";
import { IWindowInstantiateStrategy } from "./IWindowInstantiateStrategy";

export class FloatWindowStrategy implements IWindowInstantiateStrategy {
    store: AppStore;

    constructor(store: AppStore) {
        this.store = store;
    }

    instantiate() {
        return new ApplicationWindow({
            viewport: this.store.virtualViewport.currentViewport,
        });
    }
}
