import Axios, { AxiosResponse } from "axios";
import { defaultConfig } from "constants/config";
import { merge } from "lodash";
import { makeAutoObservable } from "mobx";
import { IConfig } from "models/config/IConfig";
import { IConfigRoot } from "models/config/IConfigRoot";
import { AppStore } from "stores/AppStore";

export class ConfigStore {
    private store: AppStore;

    isLoaded: boolean = false;

    config: IConfig = defaultConfig;

    async fetchConfigurations() {
        try {
            const response = await Axios.get<null, AxiosResponse<IConfigRoot>>(
                "/config/root.json",
            );

            const promises = response.data.properties.files.map((item) => {
                return Axios.get<null, AxiosResponse<IConfig>>(item);
            });

            const responses = await Promise.allSettled(promises);

            const result: IConfig[] = [];

            responses.forEach((item) => {
                if (item.status === "fulfilled") {
                    result.push(item.value.data);
                }
            });

            this.applyConfig(result);
        } catch (e) {
            console.error(e);
            this.setLoaded(true);
        }
    }

    applyConfig(configurations: IConfig[]) {
        const url = new URL(window.location.href);
        const configName = url.searchParams.get("config") ?? "default";

        const findedConfig = configurations.find(
            (item) => item.name === configName,
        );

        if (findedConfig) {
            const mergedConfig = merge(defaultConfig, findedConfig);

            this.setConfig(mergedConfig);
        }

        this.setLoaded(true);
    }

    constructor(store: AppStore) {
        this.store = store;
        makeAutoObservable(this);
    }

    setConfig(config: IConfig) {
        this.config = config;
    }

    setLoaded(value: boolean) {
        this.isLoaded = value;
    }
}
