import { action, observable } from "mobx";
import { ApplicationWindow } from "models/ApplicationWindow";
import { AppStore } from "./AppStore";

export class WindowManagerStore {
    @observable
    windows: ApplicationWindow[] = [];

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;
    }

    @action
    addWindow(appWindow: ApplicationWindow) {
        this.windows.push(appWindow);
    }
}
