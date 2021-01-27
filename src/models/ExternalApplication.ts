import { IExternalApplicationOptions } from "interfaces/options/IExternalApplicationOptions";
import { action, computed, makeObservable, observable } from "mobx";
import { Application } from "./Application";
export class ExternalApplication extends Application {
    url: string;

    customUrl: string = "";

    // emitter: ShellMessageEmitter;

    constructor(options: IExternalApplicationOptions) {
        super(options);

        makeObservable(this, {
            url: observable,
            customUrl: observable,
            applicationUrl: computed,
            // setEmitterContext: action,
            // setExecuted: action,
            setCustomUrl: action,
        });

        // this.emitter = new ShellMessageEmitter(this.id);
        try {
            const url = new URL(options.url);
            const urlParams = new URLSearchParams(url.search);
            // urlParams.set("appId", this.id);

            const resultUrl = `${url.protocol}//${url.host}${
                url.pathname
            }?${urlParams.toString()}${url.hash}`;

            this.url = resultUrl;
        } catch (e) {
            this.url = "";
            this.setAvailable(false);
        }
    }

    get applicationUrl() {
        return this.customUrl.length ? this.customUrl : this.url;
    }

    // setEmitterContext(context: Window) {
    //     this.emitter.setContext(context);
    //     return this;
    // }

    // setExecuted(value: boolean) {
    //     try {
    //         this.emitter?.clear();
    //         this.isExecuted = value;
    //         if (!value) {
    //             this.customUrl = "";
    //         }
    //     } catch (e) {
    //         console.error(e);
    //     }
    //     return this;
    // }

    setCustomUrl(url: string) {
        this.customUrl = url;
    }
}
