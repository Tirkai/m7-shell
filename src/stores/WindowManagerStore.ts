import { ShellEvents } from "enum/ShellEvents";
import { max, min } from "lodash";
import { makeAutoObservable } from "mobx";
import { ApplicationProcess } from "models/ApplicationProcess";
import { AuthEventType } from "models/auth/AuthEventType";
import { DesktopEventType } from "models/desktop/DesktopEventType";
import { PanelEventType } from "models/panel/PanelEventType";
import { ProcessEventType } from "models/process/ProcessEventType";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import { ApplicationWindowEventType } from "models/window/ApplicationWindowEventType";
import { IApplicationWindow } from "models/window/IApplicationWindow";
import { AppStore } from "./AppStore";

export class WindowManagerStore {
    windows: IApplicationWindow[] = [];

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        const { eventBus } = store.sharedEventBus;
        makeAutoObservable(this);

        // this.store.auth.eventBus.addEventListener(AuthEventType.Logout, () =>
        //     this.closeAllWindows(),
        // );

        window.addEventListener(ShellEvents.FocusShellControls, () =>
            this.clearFocus(),
        );

        window.addEventListener(ShellEvents.Resize, () => {
            this.windows
                .filter((item) => {
                    if (item instanceof ApplicationWindow) {
                        return item.isFullScreen;
                    }
                    return false;
                })
                .forEach((item) => {
                    if (item instanceof ApplicationWindow) {
                        // return item.isFullScreen;
                        item.recalculateFullScreenSize();
                    }
                });
        });

        eventBus.add(
            ProcessEventType.OnInstantiateProcess,
            (appProcess: ApplicationProcess) => this.onProcessStart(appProcess),
        );

        eventBus.add(
            ProcessEventType.OnKillProcess,
            (appProcess: ApplicationProcess) => this.onProcessKill(appProcess),
        );

        eventBus.add(DesktopEventType.OnDesktopClick, () =>
            this.onDesktopClick(),
        );

        eventBus.add(PanelEventType.OnShowAnyPanel, () =>
            this.onShowAnyPanel(),
        );

        eventBus.add(AuthEventType.OnLogout, () => this.closeAllWindows());
    }

    focusedWindow: IApplicationWindow | null = null;

    get draggedWindow() {
        return this.windows.find((item) => item.isDragging);
    }

    get hasDraggedWindow() {
        return !!this.draggedWindow;
    }

    get resizedWindow() {
        return this.windows.find(
            (item) => item instanceof ApplicationWindow && item.isResizing,
        );
    }

    get hasResizedWindow() {
        return !!this.resizedWindow;
    }

    get activeElement(): Element | null {
        return document.activeElement;
    }

    addWindow(appWindow: IApplicationWindow) {
        this.windows.push(appWindow);
        this.focusWindow(appWindow);
    }

    onProcessStart(appProcess: ApplicationProcess) {
        this.addWindow(appProcess.window);
    }

    onProcessKill(appProcess: ApplicationProcess) {
        this.closeWindow(appProcess.window);
    }

    onDesktopClick() {
        this.clearFocus();
    }

    onShowAnyPanel() {
        this.clearFocus();
    }

    focusWindow(appWindow: IApplicationWindow) {
        try {
            this.store.sharedEventBus.eventBus.dispatch(
                ApplicationWindowEventType.OnFocusWindow,
                appWindow,
            );

            window.dispatchEvent(new CustomEvent(ShellEvents.FocusAnyWindow));

            if (appWindow.isFocused) return;

            if (appWindow instanceof ApplicationWindow) {
                if (appWindow.isCollapsed) this.expandWindow(appWindow);
            }

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

    startDragWindow(appWindow: IApplicationWindow) {
        appWindow.setDragging(true);
        this.store.sharedEventBus.eventBus.dispatch(
            ApplicationWindowEventType.OnDragStart,
            appWindow,
        );
    }

    stopDragWindow(appWindow: IApplicationWindow) {
        appWindow.setDragging(false);

        this.store.sharedEventBus.eventBus.dispatch(
            ApplicationWindowEventType.OnDragStop,
            appWindow,
        );
    }

    closeWindow(appWindow: IApplicationWindow) {
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
