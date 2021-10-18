import {
    AppMessageType,
    EmitterMessage,
    ShellMessageType,
} from "@algont/m7-shell-emitter";
import { IJsonRpcResponse, JsonRpcPayload } from "@algont/m7-utils";
import Axios, { AxiosResponse } from "axios";
import { IAppParams } from "interfaces/app/IAppParams";
import { makeAutoObservable } from "mobx";
import { Application } from "models/app/Application";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { ExternalApplication } from "models/app/ExternalApplication";
import { AuthEventType } from "models/auth/AuthEventType";
import { InterceptEventType } from "models/intercept/InterceptEventType";
import { NavigationReferer } from "models/navigation/NavigationReferer";
import { NavigationRefererEventType } from "models/navigation/NavigationRefererEventType";
import { ApplicationProcess } from "models/process/ApplicationProcess";
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

        eventBus.add(
            ProcessEventType.OnKillProcess,
            (process: ApplicationProcess) => this.onKillProcess(process),
        );

        eventBus.add(
            NavigationRefererEventType.OnNavigateToReferer,
            (referer: NavigationReferer) =>
                this.onNavigateToRefererProcess(referer),
        );

        // this.bindOnMessageHandler();
    }

    onNavigateToRefererProcess(referer: NavigationReferer) {
        const process = this.processes.find(
            (item) => item.id === referer.currentProcessId,
        );
        if (process) {
            this.killProcess(process);
        }
    }

    onKillProcess(process: ApplicationProcess) {
        const viewport = process.window.viewport;

        if (viewport) {
            const viewportProcesses = this.processes.filter(
                (item) => item.window.viewport.id === viewport.id,
            );

            if (
                viewportProcesses.length <= 0 &&
                viewport.displayMode?.enableTileAttach
            ) {
                if (viewport.state.closable) {
                    this.store.sharedEventBus.eventBus.dispatch(
                        VirtualViewportEventType.OnEmptyViewportFrame,
                        { viewport, direction: -1 },
                    );
                }
            }
        }
    }

    // bindOnMessageHandler() {
    //     window.onmessage = (event: MessageEvent) => {
    //         const message: EmitterMessage<unknown> = event.data;

    //         if (message.type) {
    //             // #region Backward compatibility
    //             const matchMessageWithAppByUrlPart = (
    //                 item: ApplicationProcess,
    //             ) => {
    //                 const app = item.app as ExternalApplication;
    //                 return app.url && app.url.includes(message.source ?? "-1");
    //             };
    //             // #endregion

    //             const findedProcess = this.processes.find(
    //                 (item) =>
    //                     item.app.id === message.appId ||
    //                     // #region Required update m7-shell-emitter library in applications!
    //                     // Its important
    //                     // Remove this row after update
    //                     matchMessageWithAppByUrlPart(item),
    //                 // #endregion
    //             );

    //             if (findedProcess) {
    //                 invokeListeners(message, findedProcess.emitter.listeners);
    //             }
    //         }
    //     };
    // }

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
        this.resetProcesses({ hardReset: true });
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
                JsonRpcPayload,
                AxiosResponse<IJsonRpcResponse<IAppParams>>
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
                (message: EmitterMessage<{ url: string }>) => {
                    this.onCreateWindowInstance(message.payload, appProcess);
                },
            );

            appProcess.emitter.on(
                AppMessageType.EnableNativeEventInterception,
                (message: EmitterMessage<boolean>) =>
                    this.onEnableNativeEventInterception(message, appProcess),
            );

            appProcess.emitter.on(
                AppMessageType.HistoryLocationChange,
                (message: EmitterMessage<{ url: string }>) => {
                    this.onHistoryLocationChange(
                        message,
                        appProcess,
                        message.payload.url,
                    );
                },
            );

            Axios.post<JsonRpcPayload, AxiosResponse<IJsonRpcResponse>>(
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

    onCreateWindowInstance(
        payload: { url: string },
        refererProcess: ApplicationProcess,
    ) {
        const { url } = payload;

        const findedApp = this.store.applicationManager.findByUrlPart(url);

        const runner = new ApplicationRunner(this.store);

        if (findedApp) {
            runner.run(findedApp, {
                processOptions: { url, refererProcess },
                focusWindowAfterInstantiate: true,
            });
        } else {
            const processUrl = new URL(url);

            runner.run(
                new ExternalApplication({
                    name: processUrl.host,
                    url,
                }),
                {
                    processOptions: { refererProcess },
                    focusWindowAfterInstantiate: true,
                },
            );
        }
    }

    onEnableNativeEventInterception(
        message: EmitterMessage<boolean>,
        process: ApplicationProcess,
    ) {
        if (message.isNested) {
            return;
        }
        process.setAutoFocusSupport(true);

        process.emitter.on(AppMessageType.InterceptClick, async () =>
            this.store.sharedEventBus.eventBus.dispatch(
                InterceptEventType.OnInterceptClick,
                process,
            ),
        );

        process.emitter.on(AppMessageType.InterceptKeyPress, async () =>
            this.store.sharedEventBus.eventBus.dispatch(
                InterceptEventType.OnInterceptKeypress,
                process,
            ),
        );
    }

    onHistoryLocationChange(
        message: EmitterMessage<{ url: string }>,
        process: ApplicationProcess,
        url: string,
    ) {
        if (message.isNested) {
            return;
        }
        process.setLockedUrl(url);
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

    closeProcess(appProcess: ApplicationProcess) {
        if (appProcess.state.closable) {
            this.killProcess(appProcess);
        }
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

    resetProcesses(options?: { hardReset: boolean }) {
        let processes;
        if (!options?.hardReset) {
            processes = this.processes.filter((item) => item.state.closable);
        } else {
            processes = this.processes;
        }

        const processesCopy = [...processes];

        processesCopy.forEach((item) => {
            this.killProcess(item);
        });
    }

    // TODO: Implement checkout exist process method
    checkoutExsistProcessMethod() {
        //
    }
}
