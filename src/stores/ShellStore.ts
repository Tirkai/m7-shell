import { action, observable } from "mobx";
import { AppStore } from "./AppStore";

export class ShellStore {
    @observable
    appMenuShow: boolean = false;

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;
    }

    @action
    setAppMenuShow(value: boolean) {
        console.log("++", value);
        this.appMenuShow = value;
    }
}
