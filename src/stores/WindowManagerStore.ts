import { ShellEvents } from "enum/ShellEvents";
import { max, min } from "lodash";
import { action, computed, observable } from "mobx";
import { Application } from "models/Application";
import { ApplicationWindow } from "models/ApplicationWindow";
import { AppStore } from "./AppStore";

export class WindowManagerStore {
    @observable
    windows: ApplicationWindow[] = [];

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        window.addEventListener(ShellEvents.FocusShellControls, () =>
            this.clearFocus(),
        );
    }

    @observable
    focusedWindow: ApplicationWindow | null = null;

    @computed
    get draggedWindow() {
        return this.windows.find((item) => item.isDragging);
    }

    findWindowByApp(app: Application) {
        return this.windows.find((item) => item.application.id === app.id);
    }

    @action
    addWindow(appWindow: ApplicationWindow) {
        this.windows.push(appWindow);
        this.focusWindow(appWindow);
    }

    @action
    focusWindow(appWindow: ApplicationWindow) {
        window.dispatchEvent(new CustomEvent(ShellEvents.FocusAnyWindow));

        if (appWindow.isFocused) return;

        if (appWindow.isCollapsed) this.expandWindow(appWindow);

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
        this.focusedWindow = appWindow;
    }

    @action
    expandWindow(appWindow: ApplicationWindow) {
        appWindow.setCollapsed(false);
        appWindow.setFocused(true);
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

    @action
    clearFocus() {
        this.focusedWindow?.setFocused(false);
        this.focusedWindow = null;
    }
}
