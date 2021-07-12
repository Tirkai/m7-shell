import { DisplayModeType } from "enum/DisplayModeType";
import { ShellEvents } from "enum/ShellEvents";
import { ShellPanelType } from "enum/ShellPanelType";
import { IDisplayMode } from "interfaces/display/IDisplayMode";
import { action, makeAutoObservable, reaction } from "mobx";
import { DefaultDisplayMode } from "models/DefaultDisplayMode";
import { EmbedDisplayMode } from "models/EmbedDisplayMode";
import { AppStore } from "./AppStore";

export class ShellStore {
    get appMenuShow() {
        return this.activePanel === ShellPanelType.StartMenu;
    }

    get notificationHubShow() {
        return this.activePanel === ShellPanelType.NotificationHub;
    }

    get audioHubShow() {
        return this.activePanel === ShellPanelType.AudioHub;
    }

    enabledDevMode: boolean = false;

    activePanel: ShellPanelType = ShellPanelType.None;

    displayMode: IDisplayMode = new DefaultDisplayMode();

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

        reaction(
            () => this.displayMode,
            (mode) => this.store.windowManager.onChangeDisplayMode(mode),
        );
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
