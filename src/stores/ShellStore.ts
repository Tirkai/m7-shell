import { ShellEvents } from "enum/ShellEvents";
import { action, observable } from "mobx";
import { AppStore } from "./AppStore";

export class ShellStore {
    @observable
    appMenuShow: boolean = false;

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        window.addEventListener(ShellEvents.FocusAnyWindow, () => {
            this.setAppMenuShow(false);
        });
    }

    @action
    setAppMenuShow(value: boolean) {
        const event = new CustomEvent(
            value ? ShellEvents.StartMenuOpen : ShellEvents.StartMenuClose,
        );
        this.appMenuShow = value;
        window.dispatchEvent(event);
    }
}
