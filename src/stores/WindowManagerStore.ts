import { ShellEvents } from "enum/ShellEvents";
import { max, min } from "lodash";
import { makeAutoObservable } from "mobx";
import { Application } from "models/Application";
import { ApplicationWindow } from "models/ApplicationWindow";
import { AppStore } from "./AppStore";

export class WindowManagerStore {
    windows: ApplicationWindow[] = [];

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);

        window.addEventListener(ShellEvents.FocusShellControls, () =>
            this.clearFocus(),
        );

        window.addEventListener(ShellEvents.Resize, () => {
            this.windows
                .filter((item) => item.isFullScreen)
                .forEach((item) => {
                    item.recalculateFullScreenSize();
                });
        });
    }

    focusedWindow: ApplicationWindow | null = null;

    get draggedWindow() {
        return this.windows.find((item) => item.isDragging);
    }

    findWindowByApp(app: Application) {
        return this.windows.find((item) => item.application.id === app.id);
    }

    addWindow(appWindow: ApplicationWindow) {
        this.windows.push(appWindow);
        this.focusWindow(appWindow);
    }

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

    expandWindow(appWindow: ApplicationWindow) {
        appWindow.setCollapsed(false);
        appWindow.setFocused(true);
    }

    closeWindow(appWindow: ApplicationWindow) {
        const app = this.store.applicationManager.findById(
            appWindow.application.id,
        );
        if (app) {
            app.setExecuted(false);
        }

        this.windows.splice(this.windows.indexOf(appWindow), 1);
    }

    closeAllWindows() {
        this.windows = [];
    }

    clearFocus() {
        this.focusedWindow?.setFocused(false);
        this.focusedWindow = null;
    }
}
