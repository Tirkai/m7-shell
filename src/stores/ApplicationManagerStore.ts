import { IJsonRpcResponse, JsonRpcPayload } from "@algont/m7-utils";
import Axios, { AxiosResponse } from "axios";
import { ApplicationFactory } from "factories/ApplicationFactory";
import { IAppParams } from "interfaces/app/IAppParams";
import { IPortalApplicationResponse } from "interfaces/response/IPortalApplicationResponse";
import { strings } from "locale";
import { makeAutoObservable } from "mobx";
import { Application } from "models/app/Application";
import { ApplicationEventType } from "models/app/ApplicationEventType";
import { ExternalApplication } from "models/app/ExternalApplication";
import { registeredApps } from "registeredApps";
import { portalEndpoint } from "utils/endpoints";
import { AppStore } from "./AppStore";

export class ApplicationManagerStore {
    applications: Application[] = [];

    get displayedApplications() {
        return this.applications.filter((item) => item.isVisibleInStartMenu);
    }

    get executedApplications() {
        return this.applications.filter((item) => item.isExecuted);
    }

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);
    }

    addApplication(app: Application) {
        this.applications.push(app);
    }

    addApplicationsList(apps: Application[]) {
        this.applications = [...this.applications, ...apps];
        return this;
    }

    destroyUserSession() {
        this.applications = [];
    }

    async fetchApplications() {
        try {
            this.applications = [];

            const response = await Axios.post<
                JsonRpcPayload,
                AxiosResponse<
                    IJsonRpcResponse<IPortalApplicationResponse<IAppParams>[]>
                >
            >(
                portalEndpoint.url,
                new JsonRpcPayload("getComponents", {
                    with_shell_params: true,
                }),
            );

            if (!response.data.error) {
                const portalApplications = response.data.result.map((item) =>
                    ApplicationFactory.createExternalApplication(item),
                );
                this.addApplicationsList(portalApplications);
            }
            this.addApplicationsList(registeredApps);

            this.store.sharedEventBus.eventBus.dispatch(
                ApplicationEventType.OnApplicationListLoaded,
                this.applications,
            );
        } catch (e) {
            if (e?.response?.status !== 401) {
                this.store.message.showMessage(
                    strings.error.anOccurredError,
                    strings.error.applicationService,
                );
            } else {
                this.store.auth.logout();
            }
        }
    }

    findByKey(key: string) {
        return this.applications.find((app) => app.key === key);
    }

    findById(id: string) {
        return this.applications.find((app) => app.id === id);
    }

    findByUrlPart(url: string) {
        try {
            const hostname = new URL(url).hostname;
            return this.applications.find((app) =>
                app instanceof ExternalApplication
                    ? app.url.indexOf(hostname) > -1 && app.url.length > 0
                    : false,
            );
        } catch (e) {
            console.error(e);
        }
    }
}
