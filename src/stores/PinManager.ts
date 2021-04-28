import { makeAutoObservable } from "mobx";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import { AppStore } from "stores/AppStore";

export class PinManager {
    private store: AppStore;

    appWindow: ApplicationWindow | null = null;

    constructor(store: AppStore) {
        this.store = store;
        makeAutoObservable(this);
    }

    setWindow(appWindow: ApplicationWindow | null) {
        this.appWindow = appWindow;
    }
}
