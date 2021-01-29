import { AuthEventType } from "enum/AuthEventType";
import { NetworkStatusType } from "enum/NetworkStatusType";
import { makeAutoObservable } from "mobx";
import { AppStore } from "./AppStore";

export class NetworkStore {
    networkStatus: NetworkStatusType = NetworkStatusType.Unknown;

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);

        this.store.auth.eventBus.addEventListener(
            AuthEventType.FailedVerifyToken,
            () => {
                this.setNetworkStatus(NetworkStatusType.Trouble);
            },
        );

        this.store.auth.eventBus.addEventListener(
            AuthEventType.FailedRenewToken,
            () => {
                this.setNetworkStatus(NetworkStatusType.Trouble);
            },
        );

        this.store.auth.eventBus.addEventListener(
            AuthEventType.SuccessVerifyToken,
            () => {
                this.setNetworkStatus(NetworkStatusType.AllRight);
            },
        );
    }

    setNetworkStatus(value: NetworkStatusType) {
        this.networkStatus = value;
    }
}
