import {
    AppMessageType,
    EmitterMessage,
    invokeListeners,
} from "@algont/m7-shell-emitter";
import { IJsonRpcResponse, JsonRpcPayload } from "@algont/m7-utils";
import Axios from "axios";
import { AuthEventType } from "enum/AuthEventType";
import { IAppParams } from "interfaces/app/IAppParams";
import { makeAutoObservable } from "mobx";
import { Application } from "models/Application";
import { ApplicationProcess } from "models/ApplicationProcess";
import { ApplicationWindow } from "models/ApplicationWindow";
import { ExternalApplication } from "models/ExternalApplication";
import { portalEndpoint } from "utils/endpoints";
import { AppStore } from "./AppStore";

export class ProcessManagerStore {
    processes: ApplicationProcess[] = [];

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);

        this.store.auth.eventBus.addEventListener(AuthEventType.Logout, () =>
            this.killAllProcesses(),
        );

        window.onmessage = (event: MessageEvent) => {
            const message: EmitterMessage<unknown> = event.data;
            let apps = [];

            apps = this.store.applicationManager.applications.filter(
                (item) => item.id === message.appId,
            );

            // #region Backward compatibility m7-shell-emitter@0.6
            // Todo: Remove after update all projects
            if (!message.appId && message.source) {
                apps = this.store.applicationManager.applications.filter(
                    (item) =>
                        item instanceof ExternalApplication && message.source
                            ? item.url.indexOf(message.source) > -1
                            : false,
                );
            }
            // #endregion

            this.processes.forEach((appProccess) => {
                invokeListeners(message, appProccess.emitter.listeners);
                return;
            });
        };
    }

    async execute(appProcess: ApplicationProcess) {
        appProcess.app.setExecuted(true);

        const applicationParamsResponse = await Axios.post<
            IJsonRpcResponse<IAppParams>
        >(
            portalEndpoint.url,
            new JsonRpcPayload("getComponentShellParams", {
                component_id: appProcess.app.id,
            }),
        );

        if (!applicationParamsResponse.data.error) {
            appProcess.window.setParams(applicationParamsResponse.data.result);
        }

        // Bindings
        appProcess.emitter.on(
            AppMessageType.CreateWindowInstance,
            (payload: { url: string }) => {
                const { url } = payload;

                console.log({ payload });

                const findedApp = this.store.applicationManager.findByUrlPart(
                    url,
                );

                if (findedApp) {
                    if (!findedApp.isExecuted) {
                        const createdAppProcessInstance = new ApplicationProcess(
                            {
                                app: findedApp,
                                window: new ApplicationWindow(),
                                url,
                            },
                        );
                        this.execute(createdAppProcessInstance);
                    } else {
                        const activeProcess = this.findProcessByApp(findedApp);
                        if (activeProcess) {
                            activeProcess.setUrl(url);
                            this.store.windowManager.focusWindow(
                                activeProcess.window,
                            );
                        }
                    }
                } else {
                    const createdAppProcessInstance = new ApplicationProcess({
                        app: new ExternalApplication({
                            name: url,
                            url,
                        }),
                        window: new ApplicationWindow(),
                    });
                    this.execute(createdAppProcessInstance);
                }
            },
        );
        Axios.post<IJsonRpcResponse>(
            portalEndpoint.url,
            new JsonRpcPayload("menuClick", {
                component_id: appProcess.app.id,
            }),
        );

        this.startProcess(appProcess);
    }

    startProcess(appProcess: ApplicationProcess) {
        this.processes.push(appProcess);

        appProcess.app.setExecuted(true);

        this.store.windowManager.addWindow(appProcess.window);
    }

    killProcess(appProcess: ApplicationProcess) {
        const index = this.processes.indexOf(appProcess);

        appProcess.app.setExecuted(false);

        this.store.windowManager.closeWindow(appProcess.window);

        this.processes.splice(index, 1);
    }

    findProcessByApp(app: Application) {
        return this.processes.find((item) => item.app.id === app.id);
    }

    killAllProcesses() {
        this.processes.forEach((appProcess) => this.killProcess(appProcess));
    }
}
