import { max, min } from "lodash";
import { makeAutoObservable } from "mobx";
import { AuthEventType } from "models/auth/AuthEventType";
import { DesktopEventType } from "models/desktop/DesktopEventType";
import { InterceptEventType } from "models/intercept/InterceptEventType";
import { NavigationReferer } from "models/navigation/NavigationReferer";
import { NavigationRefererEventType } from "models/navigation/NavigationRefererEventType";
import { PanelEventType } from "models/panel/PanelEventType";
import { ShellEvents } from "models/panel/ShellEvents";
import { ApplicationProcess } from "models/process/ApplicationProcess";
import { ProcessEventType } from "models/process/ProcessEventType";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import { ApplicationWindowEventType } from "models/window/ApplicationWindowEventType";
import { ApplicationWindowType } from "models/window/ApplicationWindowType";
import { AppStore } from "./AppStore";

export class WindowManagerStore {
    windows: ApplicationWindow[] = [];

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        const { eventBus } = store.sharedEventBus;
        makeAutoObservable(this);

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

        eventBus.add(
            InterceptEventType.OnInterceptClick,
            (process: ApplicationProcess) => this.onInterceptClick(process),
        );

        eventBus.add(
            NavigationRefererEventType.OnNavigateToReferer,
            (referer: NavigationReferer) =>
                this.onNavigateToRefererProcess(referer),
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

    addWindow(appWindow: ApplicationWindow) {
        this.windows.push(appWindow);

        if (appWindow.focusAfterInstantiate) {
            this.focusWindow(appWindow);
        }
    }

    onInterceptClick(process: ApplicationProcess) {
        if (process.window.isFocused) {
            return;
        }

        this.focusWindow(process.window);
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

    onNavigateToRefererProcess(referer: NavigationReferer) {
        const window = this.windows.find(
            (item) => item.id === referer.refererWindowId,
        );
        if (window) {
            this.focusWindow(window);
        }
    }

    focusWindow(appWindow: ApplicationWindow) {
        try {
            this.store.sharedEventBus.eventBus.dispatch(
                ApplicationWindowEventType.OnFocusWindow,
                appWindow,
            );

            if (appWindow.isFocused) return;

            if (appWindow.isCollapsed) this.expandWindow(appWindow);

            const indexes = [...this.windows.map((item) => item.depthIndex)];

            const minIndex = min(indexes);

            const maxIndex = max(indexes);
            if (minIndex !== undefined && maxIndex !== undefined) {
                this.windows.forEach((item) => {
                    let index = 0;
                    if (item.id === appWindow.id) {
                        index = maxIndex - minIndex + 1;
                        appWindow.setFocused(true);
                    } else {
                        index = item.depthIndex - minIndex;
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

    startDragWindow(appWindow: ApplicationWindow) {
        appWindow.setDragging(true);
        this.store.sharedEventBus.eventBus.dispatch(
            ApplicationWindowEventType.OnDragStart,
            appWindow,
        );
    }

    stopDragWindow(appWindow: ApplicationWindow) {
        appWindow.setDragging(false);

        this.store.sharedEventBus.eventBus.dispatch(
            ApplicationWindowEventType.OnDragStop,
            appWindow,
        );
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

    applyTypeToWindow(
        appWindow: ApplicationWindow,
        value: ApplicationWindowType,
    ) {
        appWindow.setType(value);

        this.store.sharedEventBus.eventBus.dispatch(
            ApplicationWindowEventType.OnTypeChange,
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
