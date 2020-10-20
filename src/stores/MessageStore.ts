import { makeAutoObservable } from "mobx";
import { AppStore } from "./AppStore";

export class MessageStore {
    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);
    }

    isShowMessage: boolean = false;

    title: string = "";

    message: string = "";

    showMessage(title: string, message: string) {
        this.isShowMessage = true;
        this.title = title;
        this.message = message;
    }

    hideMessage() {
        this.isShowMessage = false;
        setTimeout(() => {
            this.title = "";
            this.message = "";
        }, 300);
    }
}
