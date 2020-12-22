import { EmitterMessage } from "@algont/m7-shell-emitter";
import { makeAutoObservable } from "mobx";

export class EmitterLoggerStore {
    events: EmitterMessage<unknown>[] = [];

    isInited: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

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

    addEvent(event: EmitterMessage<unknown>) {
        if (event.type?.indexOf("M7") > -1) {
            this.events.unshift(event);
        }
    }
}
