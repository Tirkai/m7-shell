import { makeAutoObservable } from "mobx";
import { EventBus } from "models/event/EventBus";
import { AppStore } from "stores/AppStore";

export class SharedEventBus {
    private store: AppStore;

    readonly eventBus: EventBus;

    constructor(store: AppStore) {
        this.store = store;

        this.eventBus = new EventBus();

        makeAutoObservable(this);
    }
}
