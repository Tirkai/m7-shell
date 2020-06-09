import { EmitterMessage } from "@algont/m7-shell-emitter";
import { action, observable } from "mobx";

export class EmiterLoggerStore {
    @observable
    events: EmitterMessage<unknown>[] = [];

    @observable
    isInited: boolean = false;

    @action
    init() {
        if (!this.isInited) {
            window.addEventListener("emitterSubmitMessage", ((
                event: CustomEvent<EmitterMessage<unknown>>,
            ) => {
                const message: EmitterMessage<unknown> = event.detail;
                this.addEvent(message);
            }) as EventListener);

            window.addEventListener("message", (event: MessageEvent) => {
                const message: EmitterMessage<unknown> = event.data;
                this.addEvent(message);
            });
            this.isInited = true;
        }
    }

    @action
    addEvent(event: EmitterMessage<unknown>) {
        if (event.type?.indexOf("M7") > -1) {
            this.events.unshift(event);
        }
    }
}
