import {
    AppMessageType,
    EmitterMessage,
    invokeListeners
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
import { ApplicationWindowEventType } from "models/window/ApplicationWindowEventType";
import { portalEndpoint } from "utils/endpoints";
import { AppStore } from "./AppStore";

export class ProcessManagerStore {
    processes: ApplicationProcess[] = [];

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);

        this.store.auth.eventBus.addEventListener(AuthEventType.Logout, () =>
            this.destroyAllProcesses(),
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
        try {
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
                appProcess.window.setParams(
                    applicationParamsResponse.data.result,
                );
            }

            // Bindings

            appProcess.emitter.on(
                AppMessageType.CreateWindowInstance,
                (payload: { url: string; appId: string }) => {
                    const { url, appId } = payload;

                    const findedApp = appId
                        ? this.store.applicationManager.findById(appId)
                        : this.store.applicationManager.findByUrlPart(url);

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
                            const activeProcess = this.findProcessByApp(
                                findedApp,
                            );
                            if (activeProcess) {
                                activeProcess.setUrl(url);
                                this.store.windowManager.focusWindow(
                                    activeProcess.window,
                                );
                            }
                        }
                    } else {
                        const processUrl = new URL(url);
                        const createdAppProcessInstance = new ApplicationProcess(
                            {
                                app: new ExternalApplication({
                                    name: processUrl.host,
                                    url,
                                }),
                                window: new ApplicationWindow(),
                            },
                        );
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
        } catch (e) {
            console.error(e);
            this.store.message.showMessage("[ph] Execute failed", "[ph]");
            appProcess.app.setExecuted(false);
        }
    }

    startProcess(appProcess: ApplicationProcess) {
        this.processes.push(appProcess);
        console.log("Start Process", appProcess);

        appProcess.app.setExecuted(true);
        // TODO:
        // Think about it
        const tileManager = this.store.tile;

        if (tileManager.hasActivePreset && tileManager.freeCells) {
            this.store.tile.attachWindowToTileCell(
                appProcess.window,
                tileManager.nearbyFreeCell,
            );
        }

        this.store.windowManager.addWindow(appProcess.window);
    }

    async killProcess(appProcess: ApplicationProcess) {
        const index = this.processes.indexOf(appProcess);

        appProcess.app.setExecuted(false);

        await appProcess.window.eventTarget.dispatch(
            ApplicationWindowEventType.OnClose,
        );

        this.store.windowManager.closeWindow(appProcess.window);

        this.processes.splice(index, 1);
    }

    findProcessByApp(app: Application) {
        return this.processes.find((item) => item.app.id === app.id);
    }

    destroyAllProcesses() {
        this.processes = [];
    }

    // TODO: Implement checkout exist process method
    checkoutExsistProcessMethod() {
        //
    }
}
