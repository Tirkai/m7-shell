import {
    AppMessageType,
    EmitterMessage,
    invokeListeners,
    ShellMessageType,
} from "@algont/m7-shell-emitter";
import { IJsonRpcResponse, JsonRpcPayload } from "@algont/m7-utils";
import Axios from "axios";
import { IAppParams } from "interfaces/app/IAppParams";
import { makeAutoObservable } from "mobx";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { Application } from "models/Application";
import { ApplicationProcess } from "models/ApplicationProcess";
import { AuthEventType } from "models/auth/AuthEventType";
import { ExternalApplication } from "models/ExternalApplication";
import { ProcessEventType } from "models/process/ProcessEventType";
import { VirtualViewportEventType } from "models/virtual/VirtualViewportEventType";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { portalEndpoint } from "utils/endpoints";
import { AppStore } from "./AppStore";

export class ProcessManagerStore {
    processes: ApplicationProcess[] = [];

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;
        const { eventBus } = this.store.sharedEventBus;
        makeAutoObservable(this);

        eventBus.add(
            VirtualViewportEventType.OnRemoveViewportFrame,
            (viewport: VirtualViewportModel) =>
                this.onRemoveViewportFrame(viewport),
        );

        eventBus.add(
            VirtualViewportEventType.OnClearViewportFrame,
            (viewport: VirtualViewportModel) =>
                this.onRemoveViewportFrame(viewport),
        );

        eventBus.add(
            ProcessEventType.OnChangeProcess,
            (process: ApplicationProcess) => this.onChangeProcess(process),
        );

        eventBus.add(AuthEventType.OnLogout, () => this.onLogout());

        eventBus.add(
            AuthEventType.OnRenewToken,
            (payload: { token: string; login: string }) =>
                this.onRecieveToken(payload),
        );

        this.bindOnMessageHandler();
    }

    bindOnMessageHandler() {
        window.onmessage = (event: MessageEvent) => {
            const message: EmitterMessage<unknown> = event.data;
            let apps = [];

            apps = this.store.applicationManager.applications.filter(
                (item) => item.id === message.appId,
            );

            if (message.type) {
                // #region Backward compatibility
                const matchMessageWithAppByUrlPart = (
                    item: ApplicationProcess,
                ) => {
                    const app = item.app as ExternalApplication;
                    return app.url && app.url.includes(message.source ?? "-1");
                };
                // #endregion

                const findedProcess = this.processes.find(
                    (item) =>
                        item.app.id === message.appId ||
                        // #region Required update m7-shell-emitter library in applications!
                        // Its important
                        // Remove this row after update
                        matchMessageWithAppByUrlPart(item),
                    // #endregion
                );

                if (findedProcess) {
                    invokeListeners(message, findedProcess.emitter.listeners);
                }
            }
        };
    }

    injectAuthTokenInProcess(
        appProccess: ApplicationProcess,
        token: string,
        login: string,
    ) {
        try {
            appProccess.emitter.emit(ShellMessageType.UpdateAuthToken, {
                token,
                login,
            });
        } catch (e) {
            console.error(e);
        }
    }

    onRecieveToken(payload: { token: string; login: string }) {
        this.processes.forEach((appProcess) =>
            this.injectAuthTokenInProcess(
                appProcess,
                payload.token,
                payload.login,
            ),
        );
    }

    onLogout() {
        this.destroyAllProcesses();
    }

    onChangeProcess(_process: ApplicationProcess) {
        //
    }

    onRemoveViewportFrame(viewport: VirtualViewportModel) {
        const findedProcesses = this.processes.filter(
            (item) => item.window.viewport?.id === viewport.id,
        );

        findedProcesses.forEach((item) => this.killProcess(item));
    }

    async execute(
        appProcess: ApplicationProcess,
        options?: { noDispatch?: boolean },
    ) {
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

                    const runner = new ApplicationRunner(this.store);

                    if (findedApp) {
                        runner.run(findedApp, {
                            url,
                            focusWindowAfterInstantiate: true,
                        });
                    } else {
                        const processUrl = new URL(url);

                        runner.run(
                            new ExternalApplication({
                                name: processUrl.host,
                                url,
                            }),
                            { focusWindowAfterInstantiate: true },
                        );
                    }
                },
            );
            Axios.post<IJsonRpcResponse>(
                portalEndpoint.url,
                new JsonRpcPayload("menuClick", {
                    component_id: appProcess.app.id,
                }),
            );

            this.startProcess(appProcess, options);
        } catch (e) {
            console.error(e);
            appProcess.app.setExecuted(false);
        }
    }

    startProcess(
        appProcess: ApplicationProcess,
        options?: { noDispatch?: boolean },
    ) {
        this.processes.push(appProcess);

        appProcess.app.setExecuted(true);

        if (options?.noDispatch) {
            return;
        }

        this.store.sharedEventBus.eventBus.dispatch<ApplicationProcess>(
            ProcessEventType.OnInstantiateProcess,
            appProcess,
        );

        this.store.sharedEventBus.eventBus.dispatch<ApplicationProcess>(
            ProcessEventType.OnChangeProcess,
            appProcess,
        );
    }

    killProcess(appProcess: ApplicationProcess) {
        const index = this.processes.indexOf(appProcess);
        appProcess.app.setExecuted(false);

        this.processes.splice(index, 1);

        this.store.sharedEventBus.eventBus.dispatch<ApplicationProcess>(
            ProcessEventType.OnKillProcess,
            appProcess,
        );

        this.store.sharedEventBus.eventBus.dispatch<ApplicationProcess>(
            ProcessEventType.OnChangeProcess,
            appProcess,
        );
    }

    findProcessByApp(app: Application) {
        return this.processes.find((item) => item.app.id === app.id);
    }

    destroyAllProcesses() {
        const processesCopy = [...this.processes];

        processesCopy.forEach((item) => {
            this.killProcess(item);
        });

        this.processes = [];
    }

    // TODO: Implement checkout exist process method
    checkoutExsistProcessMethod() {
        //
    }
}
