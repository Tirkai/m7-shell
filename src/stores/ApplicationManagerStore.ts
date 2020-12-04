import {
    AppMessageType,
    EmitterMessage,
    invokeListeners,
} from "@algont/m7-shell-emitter";
import { IJsonRpcResponse, JsonRpcPayload } from "@algont/m7-utils";
import Axios from "axios";
import { IAppParams } from "interfaces/app/IAppParams";
import { IPortalApplicationResponse } from "interfaces/response/IPortalApplicationResponse";
import { strings } from "locale";
import { makeAutoObservable } from "mobx";
import { Application } from "models/Application";
import { ApplicationWindow } from "models/ApplicationWindow";
import { ExternalApplication } from "models/ExternalApplication";
import { registeredApps } from "registeredApps";
import { portalEndpoint } from "utils/endpoints";
import { v4 } from "uuid";
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

        window.onmessage = (event: MessageEvent) => {
            const message: EmitterMessage<unknown> = event.data;
            let apps = [];

            apps = this.applications.filter(
                (item) => item.id === message.appId,
            );

            // #region Backward compatibility m7-shell-emitter@0.6
            // Todo: Remove after update all projects
            if (!message.appId && message.source) {
                apps = this.applications.filter((item) =>
                    item instanceof ExternalApplication && message.source
                        ? item.url.indexOf(message.source) > -1
                        : false,
                );
            }
            // #endregion

            apps.forEach((app) => {
                if (app instanceof ExternalApplication) {
                    invokeListeners(message, app.emitter.listeners);
                    return;
                }
            });
        };
    }

    addApplication(app: Application) {
        this.applications.push(app);
    }

    addApplicationsList(apps: Application[]) {
        this.applications = [...this.applications, ...apps];
        return this;
    }

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
                            isFullscreen:
                                appParams.maximize ?? app.isFullscreen ?? false,
                            dispayMode: this.store.shell.displayMode,
                        }),
                    );

                    // Bindings
                    if (app instanceof ExternalApplication) {
                        app.emitter.on(
                            AppMessageType.CreateWindowInstance,
                            (payload: { url: string }) => {
                                const { url } = payload;

                                const findedApp = this.findByUrlPart(url);
                                // TODO: Execute application with hash in function
                                // #region
                                const hashParams = new URLSearchParams();
                                hashParams.append("hash", v4());

                                const urlWithHash =
                                    url + "?" + hashParams.toString();
                                // #endregion
                                if (findedApp instanceof ExternalApplication) {
                                    this.executeApplicationWithUrl(
                                        findedApp,
                                        urlWithHash,
                                    );
                                } else {
                                    const instance = new ExternalApplication({
                                        id: v4(),

                                        name: app.name,
                                        url,
                                        icon: app.icon,
                                        isExistedAppInstance: true,
                                    });

                                    // TODO: Hotfix for cert
                                    // #region
                                    this.store.applicationManager.addApplication(
                                        instance,
                                    );

                                    this.store.auth.injectAuthTokenInExternalApplication(
                                        instance,
                                    );
                                    // #endregion

                                    this.executeApplicationWithUrl(
                                        instance,
                                        url,
                                    );
                                }
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

    executeApplicationWithUrl(app: ExternalApplication, url: string) {
        try {
            if (!app.isExecuted) {
                app.setExecuted(true).setCustomUrl(url);
                this.store.windowManager.addWindow(
                    new ApplicationWindow(app, {
                        id: v4(),
                        width: app.baseWidth,
                        height: app.baseHeight,
                        dispayMode: this.store.shell.displayMode,
                    }),
                );
            } else {
                app.setCustomUrl(url);

                const appWindow = this.store.windowManager.findWindowByApp(app);
                if (appWindow) {
                    this.store.windowManager.focusWindow(appWindow);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    destroyUserSession() {
        this.applications.forEach((app) => app.setExecuted(false));
    }

    async fetchApplications() {
        try {
            this.applications = [];

            const response = await Axios.post<
                IJsonRpcResponse<IPortalApplicationResponse<IAppParams>[]>
            >(
                portalEndpoint.url,
                new JsonRpcPayload("getComponents", {
                    with_shell_params: true,
                }),
            );

            if (!response.data.error) {
                const portalApplications = response.data.result.map(
                    (item) =>
                        new ExternalApplication({
                            id: item.id,
                            name: item.name,
                            url: item.guiUrl,
                            icon: item.iconUrl,
                            key: item.id,
                            place: item.shellParams?.item_place,
                        }),
                );
                this.addApplicationsList(portalApplications);
            }
            this.addApplicationsList(registeredApps);
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

    async fetchUpdateApplications() {
        try {
            // Placeholder
            await new Promise((resolve) => resolve());
            // const response = await Axios.post<
            //     IJsonRpcResponse<IPortalApplicationResponse<IAppParams>[]>
            // >(
            //     portalEndpoint.url,
            //     new JsonRpcPayload("getComponents", {
            //         with_shell_params: true,
            //     }),
            // );
            // if (!response.data.error) {
            //     const portalApplications = response.data.result.map(
            //         (item) =>
            //             new ExternalApplication({
            //                 id: item.id,
            //                 name: item.name,
            //                 url: item.guiUrl,
            //                 icon: item.iconUrl,
            //                 key: item.id,
            //             }),
            //     );
            //     const diffIds = difference(
            //         portalApplications.map((item) => item.id),
            //         this.applications
            //             .filter((item) => item instanceof ExternalApplication)
            //             .map((item) => item.id),
            //     );
            //     this.addApplicationsList(
            //         intersectionWith(
            //             portalApplications,
            //             diffIds,
            //             (a, b) => a.id === b,
            //         ),
            //     );
            // }
        } catch (e) {
            console.error(e);
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
