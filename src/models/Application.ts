import { unknownApp } from "assets/icons";
import { IApplicationOptions } from "interfaces/options/IApplicationOptions";
import { action, observable } from "mobx";

export class Application {
    id: string;
    key: string;
    name: string;
    icon: string;
    baseWidth: number;
    baseHeight: number;
    minWidth: number;
    minHeight: number;

    @observable
    isExecuted: boolean = false;

    @observable
    isVisibleInStartMenu: boolean = true;

    @observable
    isAvailable: boolean = true;

    constructor(options: IApplicationOptions) {
        this.id = options.id;
        this.name = options.name;
        this.key = options.key ?? options.id;
        this.icon =
            options.icon || options.icon?.length ? options.icon : unknownApp;
        this.baseWidth = options.baseWidth ?? 1000;
        this.baseHeight = options.baseHeight ?? 700;
        this.minWidth = options.minWidth ?? 400;
        this.minHeight = options.minHeight ?? 300;
        this.isVisibleInStartMenu = options.isVisibleInStartMenu ?? true;
    }

    @action
    setExecuted(value: boolean) {
        this.isExecuted = value;
        return this;
    }

    @action
    setAvailable(value: boolean) {
        this.isAvailable = value;
    }
}
