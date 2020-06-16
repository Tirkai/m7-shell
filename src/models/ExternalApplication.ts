import { ShellMessageEmitter } from "@algont/m7-shell-emitter";
import { IExternalApplicationOptions } from "interfaces/options/IExternalApplicationOptions";
import { Application } from "./Application";
export class ExternalApllication extends Application {
    url: string;
    emitter: ShellMessageEmitter;
    constructor(options: IExternalApplicationOptions) {
        super(options);
        this.url = options.url;
        this.emitter = new ShellMessageEmitter();
    }

    setEmitterContext(context: Window) {
        this.emitter.setContext(context);
        return this;
    }

    setExecuted(value: boolean) {
        try {
            this.emitter?.clear();
            this.isExecuted = value;
        } catch (e) {
            console.error(e);
        }
    }
}
