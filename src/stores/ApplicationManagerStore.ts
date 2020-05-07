import { action, computed, observable } from "mobx";
import { Application } from "models/Application";
import { ApplicationWindow } from "models/ApplicationWindow";
import { AppStore } from "./AppStore";
export class ApplicationManagerStore {
    @observable
    applications: Application[] = [];

    @computed
    get executedApplications() {
        return this.applications;
    }

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;
    }

    @action
    addApplication(app: Application) {
        this.applications.push(app);
    }

    @action
    executeApplication(app: Application) {
        this.store.windowManager.addWindow(
            new ApplicationWindow(app, {
                width: 1200,
                height: 800,
            }),
        );
    }
}
