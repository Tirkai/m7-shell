import { unknownApp } from "assets/icons";
import { ApplicationPlace } from "enum/ApplicationPlace";
import { IApplicationOptions } from "interfaces/options/IApplicationOptions";
import { action, makeObservable, observable } from "mobx";

export class Application {
    id: string;
    key: string;
    name: string;
    icon: string;
    baseWidth: number;
    baseHeight: number;
    minWidth: number;
    minHeight: number;
    isFullscreen: boolean = false;
    place: ApplicationPlace = ApplicationPlace.Unknown;
    isOnlyAdmin: boolean = false;

    isExecuted: boolean = false;

    isVisibleInStartMenu: boolean = true;

    isAvailable: boolean = true;

    constructor(options: IApplicationOptions) {
        makeObservable(this, {
            key: observable,
            name: observable,
            icon: observable,
            baseWidth: observable,
            baseHeight: observable,
            minWidth: observable,
            minHeight: observable,
            isFullscreen: observable,
            place: observable,
            isOnlyAdmin: observable,
            setExecuted: action,
            setAvailable: action,
        });

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
        this.isFullscreen = options.isFullscreen ?? false;
        this.place = options.place ?? ApplicationPlace.Unknown;
        this.isOnlyAdmin = options.isOnlyAdmin ?? false;
    }

    setExecuted(value: boolean) {
        this.isExecuted = value;
        return this;
    }

    setAvailable(value: boolean) {
        this.isAvailable = value;
    }
}
