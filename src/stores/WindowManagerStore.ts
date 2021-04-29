import { AuthEventType } from "enum/AuthEventType";
import { ShellEvents } from "enum/ShellEvents";
import { max, min } from "lodash";
import { makeAutoObservable } from "mobx";
import { ApplicationProcess } from "models/ApplicationProcess";
import { ProcessEventType } from "models/process/ProcessEventType";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import { ApplicationWindowEventType } from "models/window/ApplicationWindowEventType";
import { AppStore } from "./AppStore";

export class WindowManagerStore {
    windows: ApplicationWindow[] = [];

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);

        this.store.auth.eventBus.addEventListener(AuthEventType.Logout, () =>
            this.closeAllWindows(),
        );

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

        this.store.sharedEventBus.eventBus.add(
            ProcessEventType.OnInstantiateProcess,
            (appProcess: ApplicationProcess) => this.onProcessStart(appProcess),
        );

        this.store.sharedEventBus.eventBus.add(
            ProcessEventType.OnKillProcess,
            (appProcess: ApplicationProcess) => this.onProcessKill(appProcess),
        );
    }

    focusedWindow: ApplicationWindow | null = null;

    get draggedWindow() {
        return this.windows.find((item) => item.isDragging);
    }

    get hasDraggedWindow() {
        return !!this.draggedWindow;
    }

    get resizedWindow() {
        return this.windows.find((item) => item.isResizing);
    }

    get hasResizedWindow() {
        return !!this.resizedWindow;
    }

    get activeElement(): Element | null {
        return document.activeElement;
    }

    addWindow(appWindow: ApplicationWindow) {
        this.windows.push(appWindow);
        this.focusWindow(appWindow);
    }

    onProcessStart(appProcess: ApplicationProcess) {
        this.addWindow(appProcess.window);
    }

    onProcessKill(appProcess: ApplicationProcess) {
        this.closeWindow(appProcess.window);
    }

    focusWindow(appWindow: ApplicationWindow) {
        try {
            this.store.sharedEventBus.eventBus.dispatch(
                ApplicationWindowEventType.OnFocusWindow,
                appWindow,
            );

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
        } catch (e) {
            console.error(e);
        }
    }

    expandWindow(appWindow: ApplicationWindow) {
        try {
            appWindow.setCollapsed(false);
            appWindow.setFocused(true);
        } catch (e) {
            console.error(e);
        }
    }

    closeWindow(appWindow: ApplicationWindow) {
        try {
            this.store.sharedEventBus.eventBus.dispatch(
                ApplicationWindowEventType.OnClose,
                appWindow,
            );
            this.windows.splice(this.windows.indexOf(appWindow), 1);
        } catch (e) {
            console.error(e);
        }
    }

    applyCollapseToWindow(appWindow: ApplicationWindow, value: boolean) {
        appWindow.setCollapsed(value);

        this.store.sharedEventBus.eventBus.dispatch(
            ApplicationWindowEventType.OnCollapse,
            appWindow,
        );
    }

    applyFullscreenToWindow(appWindow: ApplicationWindow, value: boolean) {
        appWindow.setFullScreen(value);

        this.store.sharedEventBus.eventBus.dispatch(
            ApplicationWindowEventType.OnFullscreen,
            appWindow,
        );
    }

    closeAllWindows() {
        this.windows = [];
    }

    clearFocus() {
        try {
            this.focusedWindow?.setFocused(false);
            this.focusedWindow = null;
        } catch (e) {
            console.error(e);
        }
    }
}
