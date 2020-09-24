import { ShellEvents } from "enum/ShellEvents";
import { ShellPanelType } from "enum/ShellPanelType";
import { action, computed, observable } from "mobx";
import { DevModeModel } from "models/DevModeModel";
import moment from "moment";
import { AppStore } from "./AppStore";

export class ShellStore {
    localStorageDevModeKey = "DEV_MODE";

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

        const storagedDevMode = JSON.parse(
            localStorage.getItem(this.localStorageDevModeKey) ?? "{}",
        ) as DevModeModel;

        if (storagedDevMode) {
            if (moment(storagedDevMode.expire).diff(moment()) > 0) {
                this.setDevMode(storagedDevMode.enabled);
            }
        }
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

        localStorage.setItem(
            this.localStorageDevModeKey,
            JSON.stringify(new DevModeModel(value, moment().add(1, "hour"))),
        );
    }
}
