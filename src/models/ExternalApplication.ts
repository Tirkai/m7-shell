import { ShellMessageBroker } from "@algont/m7-shell-broker";
import { IExternalApplicationOptions } from "interfaces/options/IExternalApplicationOptions";
import { Application } from "./Application";
export class ExternalApllication extends Application {
    url: string;
    broker: ShellMessageBroker;
    constructor(options: IExternalApplicationOptions) {
        super(options);
        this.url = options.url;
        this.broker = new ShellMessageBroker();
    }

    setBrokerContext(context: Window) {
        this.broker.setContext(context);
        return this;
    }

    setExecuted(value: boolean) {
        try {
            this.broker?.unsubscribeAll();
            this.isExecuted = value;
        } catch (e) {
            console.error(e);
        }
    }
}
