import { action, computed, observable } from "mobx";
import { Application } from "models/Application";
import { ApplicationWindow } from "models/ApplicationWindow";
import { registeredApps } from "registeredApps";
import { v4 } from "uuid";
import { AppStore } from "./AppStore";
export class ApplicationManagerStore {
    @observable
    applications: Application[] = [];

    @computed
    get executedApplications() {
        return this.applications.filter((item) => item.isExecuted);
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
    addApplicationsList(apps: Application[]) {
        this.applications = [...this.applications, ...apps];
    }

    @action
    executeApplication(app: Application) {
        if (!app.isExecuted) {
            app.setExecuted(true);
            this.store.windowManager.addWindow(
                new ApplicationWindow(app, {
                    id: v4(),
                    width: app.baseWidth,
                    height: app.baseHeight,
                }),
            );
        }
    }

    @action
    destroyUserSession() {
        this.applications.forEach((app) => app.setExecuted(false));
    }

    @action
    fetchApplications() {
        this.applications = [];
        this.addApplicationsList(registeredApps);
    }

    findByKey(key: string) {
        return this.applications.find((app) => app.key === key);
    }

    findById(id: string) {
        return this.applications.find((app) => app.id === id);
    }
}
