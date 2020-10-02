import { ShellMessageEmitter } from "@algont/m7-shell-emitter";
import { IExternalApplicationOptions } from "interfaces/options/IExternalApplicationOptions";
import { action, computed, observable } from "mobx";
import { v4 } from "uuid";
import { Application } from "./Application";
export class ExternalApplication extends Application {
    @observable
    url: string;

    @observable
    customUrl: string = "";

    emitter: ShellMessageEmitter;
    constructor(options: IExternalApplicationOptions) {
        super(options);
        this.emitter = new ShellMessageEmitter(this.id);
        try {
            const [url, params] = options.url.split("?");

            const urlParams = new URLSearchParams(params);
            urlParams.set("appId", this.id);

            this.url = url + "?" + urlParams.toString();
        } catch (e) {
            this.url = "";
            this.setAvailable(false);
        }
    }

    setEmitterContext(context: Window) {
        this.emitter.setContext(context);
        return this;
    }

    @computed
    get applicationUrl() {
        return this.customUrl.length ? this.customUrl : this.url;
    }

    @action
    setExecuted(value: boolean) {
        try {
            this.emitter?.clear();
            this.isExecuted = value;
            if (!value) {
                this.customUrl = "";
            }
        } catch (e) {
            console.error(e);
        }
        return this;
    }

    @action
    setCustomUrl(url: string) {
        this.customUrl = url + "?hash=" + v4();
    }
}
