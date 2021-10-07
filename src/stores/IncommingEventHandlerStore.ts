import {
    EmitterMessage,
    invokeListeners,
    ShellMessageEmitter,
    ShellMessageType,
} from "@algont/m7-shell-emitter";
import { ExternalEventType } from "external/ExternalEventType";
import { makeAutoObservable } from "mobx";
import { ExternalApplication } from "models/app/ExternalApplication";
import { ApplicationProcess } from "models/process/ApplicationProcess";
import { AppStore } from "./AppStore";

export class IncommingEventHandlerStore {
    private store: AppStore;
    globalEmitter: ShellMessageEmitter = new ShellMessageEmitter();

    constructor(store: AppStore) {
        this.store = store;

        this.bindOnMessageHandler();

        this.globalEmitter.on(ShellMessageType.Logout, () =>
            this.store.sharedEventBus.eventBus.dispatch(
                ExternalEventType.OnLogoutExternalMessage,
            ),
        );

        makeAutoObservable(this);
    }

    invokeInGlobalScope(msg: EmitterMessage<any>) {
        invokeListeners(msg, this.globalEmitter.listeners);
    }

    bindOnMessageHandler() {
        window.onmessage = (event: MessageEvent) => {
            const message: EmitterMessage<unknown> = event.data;
            console.log("Message", message);
            if (message.type) {
                // #region Backward compatibility
                const matchMessageWithAppByUrlPart = (
                    item: ApplicationProcess,
                ) => {
                    const app = item.app as ExternalApplication;
                    return app.url && app.url.includes(message.source ?? "-1");
                };
                // #endregion

                if (message.dispatchToShellScope) {
                    this.invokeInGlobalScope(message);
                    return;
                }

                const findedProcess = this.store.processManager.processes.find(
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
}
