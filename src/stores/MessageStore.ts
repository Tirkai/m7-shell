import { action, observable } from "mobx";
import { AppStore } from "./AppStore";

export class MessageStore {
    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;
    }

    @observable
    isShowMessage: boolean = false;

    @observable
    title: string = "";

    @observable
    message: string = "";

    @action
    showMessage(title: string, message: string) {
        this.isShowMessage = true;
        this.title = title;
        this.message = message;
    }

    @action
    hideMessage() {
        this.isShowMessage = false;
        setTimeout(() => {
            this.title = "";
            this.message = "";
        }, 300);
    }
}
