import { EmiterMessage } from "@algont/m7-shell-emiter";
import { action, observable } from "mobx";

export class EmiterLoggerStore {
    @observable
    events: EmiterMessage<unknown>[] = [];

    @observable
    isInited: boolean = false;

    @action
    init() {
        if (!this.isInited) {
            window.addEventListener("emiterSubmitMessage", ((
                event: CustomEvent<EmiterMessage<unknown>>,
            ) => {
                const message: EmiterMessage<unknown> = event.detail;
                this.addEvent(message);
            }) as EventListener);

            window.addEventListener("message", (event: MessageEvent) => {
                const message: EmiterMessage<unknown> = event.data;
                this.addEvent(message);
            });
            this.isInited = true;
        }
    }

    @action
    addEvent(event: EmiterMessage<unknown>) {
        if (event.type?.indexOf("M7") > -1) {
            this.events.unshift(event);
        }
    }
}
