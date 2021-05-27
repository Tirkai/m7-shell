import { ShellPanelType } from "enum/ShellPanelType";
import { makeAutoObservable } from "mobx";
import { AuthEventType } from "models/auth/AuthEventType";
import { DesktopEventType } from "models/desktop/DesktopEventType";
import { DevModeModel } from "models/DevModeModel";
import { KeyboardEventType } from "models/hotkey/KeyboardEventType";
import { PanelEventType } from "models/panel/PanelEventType";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import { ApplicationWindowEventType } from "models/window/ApplicationWindowEventType";
import moment from "moment";
import { AppStore } from "./AppStore";

export class PanelManager {
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

    isShowRecoveryPanel: boolean = false;

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);

        this.store.sharedEventBus.eventBus.add(
            DesktopEventType.OnDesktopClick,
            () => {
                this.setActivePanel(ShellPanelType.None);
            },
        );

        this.store.sharedEventBus.eventBus.add(
            ApplicationWindowEventType.OnFocusWindow,
            (_appWindow: ApplicationWindow) =>
                this.setActivePanel(ShellPanelType.None),
        );

        this.store.sharedEventBus.eventBus.add(
            KeyboardEventType.ArrowUpWithControl,
            () => this.onKeyboardArrowUpWithControl(),
        );

        this.store.sharedEventBus.eventBus.add(
            KeyboardEventType.ArrowDownWithControl,
            () => this.onKeyboardArrowDownWithControl(),
        );

        this.store.sharedEventBus.eventBus.add(AuthEventType.OnLogout, () =>
            this.onLogout(),
        );

        // TODO: Think about it
        // this.store.sharedEventBus.eventBus.add(
        //     RecoveryEventType.OnDynamicSnapshotLoaded,
        //     () => this.onDynamicSnapshotLoaded(),
        // );

        const storagedDevMode = JSON.parse(
            localStorage.getItem(this.localStorageDevModeKey) ?? "{}",
        ) as DevModeModel;

        if (storagedDevMode) {
            if (moment(storagedDevMode.expire).diff(moment()) > 0) {
                this.setDevMode(storagedDevMode.enabled);
            }
        }
    }

    onLogout() {
        this.setActivePanel(ShellPanelType.None);
        this.setShowRecoveryPanel(false);
    }

    onKeyboardArrowUpWithControl() {
        this.setActivePanel(ShellPanelType.Virtual);
    }

    onKeyboardArrowDownWithControl() {
        this.setActivePanel(ShellPanelType.None);
    }

    // TODO: Think about it
    onDynamicSnapshotLoaded() {
        this.setShowRecoveryPanel(true);
    }

    setActivePanel(panel: ShellPanelType) {
        this.activePanel = panel;

        if (panel !== ShellPanelType.None) {
            this.store.sharedEventBus.eventBus.dispatch(
                PanelEventType.OnShowAnyPanel,
                panel,
            );
        } else {
            this.store.sharedEventBus.eventBus.dispatch(
                PanelEventType.OnHideAnyPanel,
                panel,
            );
        }
        this.store.sharedEventBus.eventBus.dispatch(
            PanelEventType.OnChangePanel,
            panel,
        );
    }

    setDevMode(value: boolean) {
        this.enabledDevMode = value;

        localStorage.setItem(
            this.localStorageDevModeKey,
            JSON.stringify(new DevModeModel(value, moment().add(1, "hour"))),
        );
    }

    setShowRecoveryPanel(value: boolean) {
        this.isShowRecoveryPanel = value;
    }
}
