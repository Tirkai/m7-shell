import { ShellMessageEmiter } from "@algont/m7-shell-emiter";
import { IExternalApplicationOptions } from "interfaces/options/IExternalApplicationOptions";
import { Application } from "./Application";
export class ExternalApllication extends Application {
    url: string;
    emiter: ShellMessageEmiter;
    constructor(options: IExternalApplicationOptions) {
        super(options);
        this.url = options.url;
        this.emiter = new ShellMessageEmiter();
    }

    setEmiterContext(context: Window) {
        this.emiter.setContext(context);
        return this;
    }

    setExecuted(value: boolean) {
        try {
            this.emiter?.clear();
            this.isExecuted = value;
        } catch (e) {
            console.error(e);
        }
    }
}
