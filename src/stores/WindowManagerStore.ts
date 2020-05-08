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

    @action
    closeWindow(appWindow: ApplicationWindow) {
        const app = this.store.applicationManager.findById(
            appWindow.application.id,
        );
        if (app) {
            app.setExecuted(false);
        }

        this.windows.splice(this.windows.indexOf(appWindow), 1);
    }
}
