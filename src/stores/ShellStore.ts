import { ShellEvents } from "enum/ShellEvents";
import { ShellPanelType } from "enum/ShellPanelType";
import { action, computed, observable } from "mobx";
import { AppStore } from "./AppStore";

export class ShellStore {
    @computed
    get appMenuShow() {
        return this.activePanel === ShellPanelType.StartMenu;
    }

    @computed
    get notificationHubShow() {
        return this.activePanel === ShellPanelType.NotificationHub;
    }

    @observable
    enabledDevMode: boolean = process.env.NODE_ENV === "development";

    @observable
    activePanel: ShellPanelType = ShellPanelType.None;

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        window.addEventListener(ShellEvents.DesktopClick, () => {
            this.activePanel = ShellPanelType.None;
            this.store.windowManager.clearFocus();
        });

        window.addEventListener(ShellEvents.FocusAnyWindow, () => {
            this.activePanel = ShellPanelType.None;
        });

        window.addEventListener(ShellEvents.StartMenuOpen, () => {
            this.store.windowManager.clearFocus();
        });

        window.addEventListener(ShellEvents.NotificationHubOpen, () => {
            this.store.windowManager.clearFocus();
        });
    }

    @action
    setActivePanel(panel: ShellPanelType) {
        this.activePanel = panel;

        switch (panel) {
            case ShellPanelType.StartMenu: {
                window.dispatchEvent(
                    new CustomEvent(ShellEvents.StartMenuOpen),
                );
                break;
            }
            case ShellPanelType.NotificationHub: {
                window.dispatchEvent(
                    new CustomEvent(ShellEvents.NotificationHubOpen),
                );
                break;
            }
            default:
                break;
        }
    }

    @action
    setDevMode(value: boolean) {
        this.enabledDevMode = value;
    }
}
