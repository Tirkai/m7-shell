import { UtilsFunctions } from "@algont/m7-utils";
import { makeAutoObservable } from "mobx";
import { Application } from "models/Application";

export enum AutorunModeType {
    App = "app",
    Url = "url",
}

export class LaunchQueryBuilderStore {
    enableAutoRun: boolean = false;
    autoRunMode: AutorunModeType = AutorunModeType.App;
    autoRunApp: Application | null = null;
    autoRunUrl: string = "http://";
    autoRunFullscreen: boolean = false;

    enableAutoLogin: boolean = false;
    login: string = "";
    password: string = "";

    constructor() {
        makeAutoObservable(this);
    }

    get query() {
        const params = new URLSearchParams();
        const domain = `http://shell.${UtilsFunctions.getUpperLevelDomain()}`;
        if (this.enableAutoRun) {
            params.append("enableAutoRun", "1");
            switch (this.autoRunMode) {
                case AutorunModeType.App:
                    params.append("autoRunApp", this.autoRunApp?.id ?? "");
                    break;
                case AutorunModeType.Url:
                    params.append("autoRunUrl", this.autoRunUrl);
                    break;
                default:
                    break;
            }
            if (this.autoRunFullscreen) {
                params.append("autoRunFullscreen", "1");
            }
        }

        if (this.enableAutoLogin) {
            params.append("enableAutoLogin", "1");
            params.append("login", this.login);
            params.append("password", this.password);
        }

        return domain + "?" + params.toString();
    }

    setEnableAutoRun(value: boolean) {
        this.enableAutoRun = value;
    }
    setAutoRunMode(value: AutorunModeType) {
        this.autoRunMode = value;
    }
    setAutoRunApp(value: Application) {
        this.autoRunApp = value;
    }
    setautoRunUrl(value: string) {
        this.autoRunUrl = value;
    }
    setAutoRunFullscreen(value: boolean) {
        this.autoRunFullscreen = value;
    }
    setEnableAutoLogin(value: boolean) {
        this.enableAutoLogin = value;
    }
    setLogin(value: string) {
        this.login = value;
    }
    setPassword(value: string) {
        this.password = value;
    }

    reset() {
        this.enableAutoRun = false;
        this.enableAutoLogin = false;
    }
}
