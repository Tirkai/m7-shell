import Axios from "axios";
import { IJsonRpcResponse } from "interfaces/response/IJsonRpcResponse";
import { IPortalApplicationResponse } from "interfaces/response/IPortalApplicationResponse";
import { action, computed, observable } from "mobx";
import { Application } from "models/Application";
import { ApplicationWindow } from "models/ApplicationWindow";
import { ExternalApllication } from "models/ExternalApplication";
import { registeredApps } from "registeredApps";
import { portalEndpoint } from "utils/endpoints";
import { JsonRpcPayload } from "utils/JsonRpcPayload";
import { v4 } from "uuid";
import { AppStore } from "./AppStore";
export class ApplicationManagerStore {
    @observable
    applications: Application[] = [];

    @observable
    search: string = "";

    @action
    setSearch(value: string) {
        this.search = value;
    }

    @computed
    get findedApplicatons() {
        return this.displayedApplications.filter(
            (app) =>
                app.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1,
        );
    }

    @computed
    get displayedApplications() {
        return this.applications.filter((item) => item.isVisibleInStartMenu);
    }

    @computed
    get isSearching() {
        return this.search.length > 0;
    }

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
        return this;
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

    executeApplicationWithUrl(app: ExternalApllication, url: string) {
        if (!app.isExecuted) {
            app.setExecuted(true).setCustomUrl(url);
            this.store.windowManager.addWindow(
                new ApplicationWindow(app, {
                    id: v4(),
                    width: app.baseWidth,
                    height: app.baseHeight,
                }),
            );
        } else {
            app.setCustomUrl(url);
        }
    }

    @action
    destroyUserSession() {
        this.applications.forEach((app) => app.setExecuted(false));
    }

    @action
    async fetchApplications() {
        this.applications = [];

        const response = await Axios.post<
            IJsonRpcResponse<IPortalApplicationResponse[]>
        >(portalEndpoint.url, new JsonRpcPayload("getComponents"));

        if (!response.data.error) {
            const portalApplications = response.data.result.map(
                (item) =>
                    new ExternalApllication({
                        id: item.id,
                        name: item.name,
                        url: item.guiUrl,
                        icon: item.iconUrl,
                        key: item.id,
                    }),
            );
            this.addApplicationsList(portalApplications);
        }
        this.addApplicationsList(registeredApps);
    }

    findByKey(key: string) {
        return this.applications.find((app) => app.key === key);
    }

    findById(id: string) {
        return this.applications.find((app) => app.id === id);
    }
}
