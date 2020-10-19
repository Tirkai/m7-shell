import { ShellEvents } from "enum/ShellEvents";
import { ShellPanelType } from "enum/ShellPanelType";
import { action, makeAutoObservable } from "mobx";
import { DevModeModel } from "models/DevModeModel";
import moment from "moment";
import { AppStore } from "./AppStore";

export class ShellStore {
    localStorageDevModeKey = "DEV_MODE";

    get appMenuShow() {
        return this.activePanel === ShellPanelType.StartMenu;
    }

    get notificationHubShow() {
        return this.activePanel === ShellPanelType.NotificationHub;
    }

    get audioHubShow() {
        return this.activePanel === ShellPanelType.AudioHub;
    }

    enabledDevMode: boolean = process.env.NODE_ENV === "development";

    activePanel: ShellPanelType = ShellPanelType.None;

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);

        window.addEventListener(
            ShellEvents.DesktopClick,
            action(() => {
                this.activePanel = ShellPanelType.None;
                this.store.windowManager.clearFocus();
            }),
        );

        window.addEventListener(
            ShellEvents.FocusAnyWindow,
            action(() => {
                this.activePanel = ShellPanelType.None;
            }),
        );

        window.addEventListener(
            ShellEvents.StartMenuOpen,
            action(() => {
                this.store.windowManager.clearFocus();
            }),
        );

        window.addEventListener(
            ShellEvents.NotificationHubOpen,
            action(() => {
                this.store.windowManager.clearFocus();
            }),
        );

        window.addEventListener(
            ShellEvents.AudioHubOpen,
            action(() => {
                this.store.windowManager.clearFocus();
            }),
        );

        const storagedDevMode = JSON.parse(
            localStorage.getItem(this.localStorageDevModeKey) ?? "{}",
        ) as DevModeModel;

        if (storagedDevMode) {
            if (moment(storagedDevMode.expire).diff(moment()) > 0) {
                this.setDevMode(storagedDevMode.enabled);
            }
        }
    }

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
            case ShellPanelType.AudioHub: {
                window.dispatchEvent(new CustomEvent(ShellEvents.AudioHubOpen));
                break;
            }
            default:
                break;
        }
    }

    setDevMode(value: boolean) {
        this.enabledDevMode = value;

        localStorage.setItem(
            this.localStorageDevModeKey,
            JSON.stringify(new DevModeModel(value, moment().add(1, "hour"))),
        );
    }
}
