import { max, min } from "lodash";
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
        this.focusWindow(appWindow);
    }

    @action
    focusWindow(appWindow: ApplicationWindow) {
        if (appWindow.isFocused) return;
        const indexes = [...this.windows.map((item) => item.depthIndex)];

        const minIndex = min(indexes);

        const maxIndex = max(indexes);

        if (minIndex && maxIndex) {
            this.windows.forEach((item) => {
                let index = 0;
                if (item.id === appWindow.id) {
                    index = maxIndex - minIndex + 2;
                    appWindow.setFocused(true);
                } else {
                    index = item.depthIndex - minIndex + 1;
                    item.setFocused(false);
                }
                item.setDepthIndex(index);
            });
        }
    }

    @action
    expandWindow(appWindow: ApplicationWindow) {
        appWindow.setCollapsed(false);
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

    @action
    closeAllWindows() {
        this.windows = [];
    }
}
