import { ShellMessageEmitter } from "@algont/m7-shell-emitter";
import { v4 } from "uuid";
import { Application } from "./Application";
import { ApplicationWindow } from "./ApplicationWindow";
import { ExternalApplication } from "./ExternalApplication";

interface IApplicationProcessOptions {
    app: Application;
    window: ApplicationWindow;
    url?: string;
    name?: string;
    params?: Map<string, string>;
}

export class ApplicationProcess {
    id: string;
    app: Application;
    url: string;
    name: string;
    window: ApplicationWindow;
    params: Map<string, string>;
    emitter: ShellMessageEmitter;
    hash: string;

    constructor(options: IApplicationProcessOptions) {
        this.id = v4();
        this.hash = v4();
        this.app = options.app;
        this.window = options.window;
        this.params = options.params ?? new Map();
        this.emitter = new ShellMessageEmitter(this.app.id);
        this.name = options.name ?? this.app.name;

        if (this.app instanceof ExternalApplication) {
            this.url = options.url ?? this.app.url;
        } else {
            this.url = options.url ?? "";
        }
    }

    setEmitterContext(context: Window) {
        this.emitter.setContext(context);
        return this;
    }

    setName(value: string) {
        this.name = value;
    }

    get modifiedUrl() {
        if (this.app instanceof ExternalApplication) {
            const url = new URL(this.url);

            url.searchParams.set("hash", this.hash);
            url.searchParams.set("appId", this.app.id);

            this.params.forEach((value, key) =>
                url.searchParams.set(key, value),
            );

            return url.toString();
        }
        return "";
    }
}
