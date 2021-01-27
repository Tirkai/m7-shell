import { makeAutoObservable } from "mobx";
import { AppStore } from "./AppStore";

export class EventStore {
    target: EventTarget;

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;
        this.target = new EventTarget();
        makeAutoObservable(this);
    }
}
