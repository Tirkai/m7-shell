import { unknownApp } from "assets/icons";
import { IApplicationOptions } from "interfaces/options/IApplicationOptions";
import { action } from "mobx";

export class Application {
    id: string;
    key: string;
    name: string;
    icon: string;
    baseWidth: number;
    baseHeight: number;
    isExecuted: boolean = false;
    isVisibleInStartMenu: boolean = true;

    constructor(options: IApplicationOptions) {
        this.id = options.id;
        this.name = options.name;
        this.key = options.key ?? options.id;
        this.icon = options.icon ?? unknownApp;
        this.baseWidth = options.baseWidth ?? 1000;
        this.baseHeight = options.baseHeight ?? 700;
        this.isVisibleInStartMenu = options.isVisibleInStartMenu ?? true;
    }

    @action
    setExecuted(value: boolean) {
        this.isExecuted = value;
    }
}
