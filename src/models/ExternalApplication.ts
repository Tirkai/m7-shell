import { IExternalApplicationOptions } from "interfaces/options/IExternalApplicationOptions";
import { Application } from "./Application";

export class ExternalApllication extends Application {
    url: string;
    constructor(options: IExternalApplicationOptions) {
        super(options);
        this.url = options.url;
    }
}
