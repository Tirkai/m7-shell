import { IExternalApplicationOptions } from "interfaces/options/IExternalApplicationOptions";
import { makeObservable, observable } from "mobx";
import { Application } from "./Application";
export class ExternalApplication extends Application {
    url: string;

    constructor(options: IExternalApplicationOptions) {
        super(options);

        makeObservable(this, {
            url: observable,
        });

        this.url = options.url;
    }
}
