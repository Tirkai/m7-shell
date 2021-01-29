import { AuthEventType } from "enum/AuthEventType";
import { makeAutoObservable } from "mobx";
import { AppStore } from "./AppStore";

export class MessageStore {
    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);

        this.store.auth.eventBus.addEventListener(
            AuthEventType.FailedRenewToken,
            ((event: CustomEvent<string>) => {
                this.showMessage("Error", "FailedRenewToken");
            }) as EventListener,
        );

        this.store.auth.eventBus.addEventListener(
            AuthEventType.FailedVerifyToken,
            ((event: CustomEvent<string>) => {
                this.showMessage("Error", "FailedVerifyToken");
            }) as EventListener,
        );

        this.store.auth.eventBus.addEventListener(
            AuthEventType.TokenNotFound,
            ((event: CustomEvent<string>) => {
                this.showMessage("Error", "TokenNotFound");
            }) as EventListener,
        );
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
