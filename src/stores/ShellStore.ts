import { DisplayModeType } from "enum/DisplayModeType";
import { ShellPanelType } from "enum/ShellPanelType";
import { IDisplayMode } from "interfaces/display/IDisplayMode";
import { makeAutoObservable } from "mobx";
import { DefaultDisplayMode } from "models/DefaultDisplayMode";
import { DesktopEventType } from "models/desktop/DesktopEventType";
import { DevModeModel } from "models/DevModeModel";
import { EmbedDisplayMode } from "models/EmbedDisplayMode";
import { PanelEventType } from "models/panel/PanelEventType";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import { ApplicationWindowEventType } from "models/window/ApplicationWindowEventType";
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

    displayMode: IDisplayMode = new DefaultDisplayMode();

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

        // window.addEventListener(
        //     ShellEvents.FocusAnyWindow,
        //     action(() => {
        //         this.activePanel = ShellPanelType.None;
        //     }),
        // );

        // window.addEventListener(
        //     ShellEvents.StartMenuOpen,
        //     action(() => {
        //         this.store.windowManager.clearFocus();
        //     }),
        // );

        // window.addEventListener(
        //     ShellEvents.NotificationHubOpen,
        //     action(() => {
        //         this.store.windowManager.clearFocus();
        //     }),
        // );

        // window.addEventListener(
        //     ShellEvents.AudioHubOpen,
        //     action(() => {
        //         this.store.windowManager.clearFocus();
        //     }),
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

    setDisplayMode(value: DisplayModeType) {
        switch (value) {
            case DisplayModeType.Default:
                return (this.displayMode = new DefaultDisplayMode());
            case DisplayModeType.Embed:
                return (this.displayMode = new EmbedDisplayMode());
            default:
                break;
        }
    }
}
