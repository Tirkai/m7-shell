import { unknownApp } from "assets/icons";
import { IApplicationOptions } from "interfaces/options/IApplicationOptions";
import { action } from "mobx";

export class Application {
    id: string;
    name: string;
    icon: string;
    baseWidth: number;
    baseHeight: number;
    isExecuted: boolean = false;

    constructor(options: IApplicationOptions) {
        this.id = options.id;
        this.name = options.name;
        this.icon = options.icon ?? unknownApp;
        this.baseWidth = options.baseWidth ?? 1200;
        this.baseHeight = options.baseHeight ?? 800;
    }

    @action
    setExecuted(value: boolean) {
        this.isExecuted = value;
    }
}
