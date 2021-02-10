import { NetworkStatusType } from "enum/NetworkStatusType";
import { makeAutoObservable } from "mobx";
import { AppStore } from "./AppStore";

export class NetworkStore {
    networkStatus: NetworkStatusType = NetworkStatusType.Unknown;

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);
    }

    setNetworkStatus(value: NetworkStatusType) {
        this.networkStatus = value;
    }
}
