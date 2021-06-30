import { makeAutoObservable } from "mobx";
import { IConfig } from "models/config/IConfig";
import { AppStore } from "stores/AppStore";

const defaultConfigName = "default";

export class ConfigStore {
    private store: AppStore;
    config: IConfig = this.loadConfig(defaultConfigName);

    loadConfig(name: string) {
        const param = (window as any).shellConfig[name];

        return param;
    }

    constructor(store: AppStore) {
        this.store = store;
        makeAutoObservable(this);

        let configPath = defaultConfigName;

        const url = new URL(window.location.href);

        const paramName = url.searchParams.get("config");

        if (paramName) {
            configPath = paramName;
        }

        const cfg = this.loadConfig(configPath);

        if (cfg) {
            this.config = cfg;
        } else {
            alert("Не удалось загрузить конфигурацию");
            this.setConfig(this.loadConfig(defaultConfigName));
        }
    }

    setConfig(config: IConfig) {
        this.config = config;
    }

    overrideConfigParam(key: string, value: any) {
        const cfg = { ...this.config, ...{ [key]: value } };

        this.setConfig(cfg);
    }
}
