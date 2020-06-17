import { ShellEvents } from "enum/ShellEvents";
import { action, observable } from "mobx";
import { AppStore } from "./AppStore";

export class ShellStore {
    @observable
    appMenuShow: boolean = false;

    @observable
    notificationHubShow: boolean = false;

    @observable
    enabledDevMode: boolean = false;

    focusEvent = new CustomEvent(ShellEvents.FocusShellControls);

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        window.addEventListener(ShellEvents.DesktopClick, () => {
            this.setAppMenuShow(false);
            this.setNotificationHubShow(false);
            this.store.windowManager.clearFocus();
        });

        window.addEventListener(ShellEvents.FocusAnyWindow, () => {
            this.setAppMenuShow(false);
            this.setNotificationHubShow(false);
        });
    }

    @action
    setAppMenuShow(value: boolean) {
        this.appMenuShow = value;
        if (value) {
            window.dispatchEvent(this.focusEvent);
        }
    }

    @action
    setNotificationHubShow(value: boolean) {
        this.notificationHubShow = value;
        if (value) {
            window.dispatchEvent(this.focusEvent);
        }
    }

    @action
    setDevMode(value: boolean) {
        this.enabledDevMode = value;
    }
}
