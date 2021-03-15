import { makeAutoObservable } from "mobx";
import { AppStore } from "stores/AppStore";

export class DesktopStore {
    private store: AppStore;

    isEditMode: boolean = false;
    isLayoutMode: boolean = false;

    constructor(store: AppStore) {
        this.store = store;
        makeAutoObservable(this);
    }

    setEditMode(value: boolean) {
        this.isEditMode = value;
    }

    setLayoutMode(value: boolean) {
        this.isLayoutMode = value;
    }
}
