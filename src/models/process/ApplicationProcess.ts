import { ShellMessageEmitter } from "@algont/m7-shell-emitter";
import { makeAutoObservable } from "mobx";
import { v4 } from "uuid";
import { Application } from "../app/Application";
import { ExternalApplication } from "../app/ExternalApplication";
import { VirtualViewportModel } from "../virtual/VirtualViewportModel";
import { ApplicationWindow } from "../window/ApplicationWindow";
import { ApplicationProcessDefaultState } from "./ApplicationProcessDefaultState";
import { IApplicationProcessState } from "./IApplicationProcessState";

export interface IApplicationProcessOptionalOptions {
    url?: string;
    name?: string;
    params?: Map<string, string>;
    disableParams?: boolean;
    viewport?: VirtualViewportModel;
    state?: IApplicationProcessState;
    refererProcess?: ApplicationProcess;
}

export interface IApplicationProcessOptions
    extends IApplicationProcessOptionalOptions {
    app: Application;
    window: ApplicationWindow;
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
    disableParams: boolean;
    isReady: boolean;
    state: IApplicationProcessState;
    lockedUrl: string;
    isAutoFocusSupport: boolean;
    refererProcess?: ApplicationProcess;

    constructor(options: IApplicationProcessOptions) {
        makeAutoObservable(this);

        this.id = v4();
        this.hash = v4();
        this.app = options.app;
        this.window = options.window;
        this.params = options.params ?? new Map();
        this.emitter = new ShellMessageEmitter(this.app.id);
        this.name = options.name ?? this.app.name;
        this.disableParams = options.disableParams ?? false;
        this.isReady = false;
        this.state = options.state ?? new ApplicationProcessDefaultState();
        this.lockedUrl = "";
        this.isAutoFocusSupport = false;
        this.refererProcess = options.refererProcess;

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

    setUrl(value: string) {
        this.url = value;
    }

    setParams(value: Map<string, string>) {
        this.params = value;
    }

    setWindow(appWindow: ApplicationWindow) {
        this.window = appWindow;
    }

    setLockedUrl(value: string) {
        this.lockedUrl = value;
    }

    setAutoFocusSupport(value: boolean) {
        this.isAutoFocusSupport = value;
    }

    rerollHash() {
        this.params.set("hash", v4());
    }

    setRefererProcess(appProcess: ApplicationProcess) {
        this.refererProcess = appProcess;
    }

    get modifiedUrl() {
        try {
            if (this.app instanceof ExternalApplication) {
                let url = new URL(this.url);
                if (this.lockedUrl.length) {
                    url = new URL(this.lockedUrl);
                }

                if (!this.disableParams) {
                    url.searchParams.set("hash", this.hash);
                    url.searchParams.set("appId", this.app.id);

                    this.params.forEach((value, key) =>
                        url.searchParams.set(key, value),
                    );
                }

                return url.toString();
            }
            return "";
        } catch (e) {
            console.error(e);
            return "";
        }
    }
}
