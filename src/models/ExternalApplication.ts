import { IExternalApplicationOptions } from "interfaces/options/IExternalApplicationOptions";
import { ShellMessageBroker } from "m7-shell-broker";
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
}
