import { makeAutoObservable } from "mobx";
import { AuthEventType } from "models/auth/AuthEventType";
import { DevModeModel } from "models/debug/DevModeModel";
import { DesktopEventType } from "models/desktop/DesktopEventType";
import { KeyboardEventType } from "models/hotkey/KeyboardEventType";
import { AppsMenuViewMode } from "models/menu/AppsMenuViewMode";
import { PanelEventType } from "models/panel/PanelEventType";
import { ShellPanelType } from "models/panel/ShellPanelType";
import { ISessionRecovery } from "models/recovery/ISessionRecovery";
import { RecoveryEventType } from "models/recovery/RecoveryEventType";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import { ApplicationWindowEventType } from "models/window/ApplicationWindowEventType";
import moment from "moment";
import { AppStore } from "./AppStore";

export class PanelManager {
    localStorageDevModeKey = "DEV_MODE";

    appsMenuViewMode: AppsMenuViewMode = AppsMenuViewMode.Grid;

    get appMenuShow() {
        return this.activePanel === ShellPanelType.StartMenu;
    }

    get notificationHubShow() {
        return this.activePanel === ShellPanelType.NotificationHub;
    }

    get audioHubShow() {
        return this.activePanel === ShellPanelType.AudioHub;
    }

    get devModeHubShow(){
        return this.activePanel === ShellPanelType.DevModeHub;
    }

    enabledDevMode: boolean = process.env.NODE_ENV === "development";

    activePanel: ShellPanelType = ShellPanelType.None;

    isShowRecoveryPanel: boolean = false;

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);

        const { eventBus } = this.store.sharedEventBus;

        eventBus.add(
            RecoveryEventType.OnDynamicSnapshotLoaded,
            (payload: ISessionRecovery) => {
                this.onDynamicSnapshotLoaded(payload);
            },
        );

        eventBus.add(DesktopEventType.OnDesktopClick, () => {
            this.setActivePanel(ShellPanelType.None);
        });

        eventBus.add(
            ApplicationWindowEventType.OnFocusWindow,
            (_appWindow: ApplicationWindow) =>
                this.setActivePanel(ShellPanelType.None),
        );

        eventBus.add(KeyboardEventType.ArrowUpWithControl, () =>
            this.onKeyboardArrowUpWithControl(),
        );

        eventBus.add(KeyboardEventType.ArrowDownWithControl, () =>
            this.onKeyboardArrowDownWithControl(),
        );

        eventBus.add(AuthEventType.OnLogout, () => this.onLogout());

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
    onDynamicSnapshotLoaded(snapshot: ISessionRecovery) {
        if (snapshot.processSnapshot.hasActiveSession) {
            this.setShowRecoveryPanel(true);
        }
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

    setAppsMenuViewMode(value: AppsMenuViewMode) {
        this.appsMenuViewMode = value;
    }
}
