import { AppMessageType } from "@algont/m7-shell-emitter";
import { IJsonRpcResponse, JsonRpcPayload } from "@algont/m7-utils";
import Axios from "axios";
import { IAppParams } from "interfaces/app/IAppParams";
import { IPortalApplicationResponse } from "interfaces/response/IPortalApplicationResponse";
import { strings } from "locale";
import { action, computed, observable } from "mobx";
import { Application } from "models/Application";
import { ApplicationWindow } from "models/ApplicationWindow";
import { ExternalApllication } from "models/ExternalApplication";
import { registeredApps } from "registeredApps";
import { portalEndpoint } from "utils/endpoints";
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
    async executeApplication(app: Application) {
        const errorTitle = strings.error.anOccurredError;
        const serviceErrorText = strings.error.applicationService;
        try {
            if (!app.isExecuted) {
                const applicationParamsResponse = await Axios.post<
                    IJsonRpcResponse<IAppParams>
                >(
                    portalEndpoint.url,
                    new JsonRpcPayload("getComponentShellParams", {
                        component_id: app.id,
                    }),
                );

                if (!applicationParamsResponse.data.error) {
                    const appParams = applicationParamsResponse.data.result;

                    app.setExecuted(true);
                    this.store.windowManager.addWindow(
                        new ApplicationWindow(app, {
                            id: v4(),
                            width: appParams.width ?? app.baseWidth,
                            height: appParams.height ?? app.baseHeight,
                            isFullscreen: appParams.maximize ?? false,
                        }),
                    );

                    // Bindings
                    if (app instanceof ExternalApllication) {
                        app.emitter.on(
                            AppMessageType.CreateWindowInstance,
                            (payload: { url: string }) => {
                                const { url } = payload;
                                this.createExecutedApllicationInstance(
                                    app,
                                    url,
                                );
                            },
                        );
                    }
                } else {
                    this.store.message.showMessage(
                        errorTitle,
                        serviceErrorText,
                    );
                }
            }
        } catch (e) {
            this.store.message.showMessage(errorTitle, serviceErrorText);
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

    createExecutedApllicationInstance(app: ExternalApllication, url: string) {
        const newInstance = new ExternalApllication({
            ...app,
            id: v4(),
            key: app.key,
            url,
        });

        const instance = new ApplicationWindow(newInstance, {
            id: v4(),
            width: app.baseWidth,
            height: app.baseHeight,
        });

        this.store.windowManager.addWindow(instance);
    }

    @action
    destroyUserSession() {
        this.applications.forEach((app) => app.setExecuted(false));
    }

    @action
    async fetchApplications() {
        try {
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
        } catch (e) {
            this.store.message.showMessage(
                strings.error.anOccurredError,
                strings.error.applicationService,
            );
        }
    }

    findByKey(key: string) {
        return this.applications.find((app) => app.key === key);
    }

    findById(id: string) {
        return this.applications.find((app) => app.id === id);
    }
}
