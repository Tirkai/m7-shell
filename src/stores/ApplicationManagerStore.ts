import { action, computed, observable } from "mobx";
import { Application } from "models/Application";
import { ApplicationWindow } from "models/ApplicationWindow";
import { v4 } from "uuid";
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
        app.setExecuted(true);
        this.store.windowManager.addWindow(
            new ApplicationWindow(app, {
                id: v4(),
                width: app.baseWidth,
                height: app.baseHeight,
            }),
        );
    }

    findByName(name: string) {
        return this.applications.find((app) => app.name === name);
    }

    findById(id: string) {
        return this.applications.find((app) => app.id === id);
    }
}
