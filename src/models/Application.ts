import { unknownApp } from "assets/icons";
import { ApplicationPlace } from "enum/ApplicationPlace";
import { IApplicationOptions } from "interfaces/options/IApplicationOptions";
import { action, makeObservable, observable } from "mobx";
import { v4 } from "uuid";

export class Application {
    id: string;
    key: string;
    name: string;
    icon: string;
    isFullscreen: boolean = false;
    place: ApplicationPlace = ApplicationPlace.Unknown;
    isOnlyAdmin: boolean = false;

    isExecuted: boolean = false;

    isVisibleInStartMenu: boolean = true;

    isExistedAppInstance: boolean = false;

    isAvailable: boolean = true;

    constructor(options: IApplicationOptions) {
        makeObservable(this, {
            key: observable,
            name: observable,
            icon: observable,
            isFullscreen: observable,
            place: observable,
            isOnlyAdmin: observable,
            isExistedAppInstance: observable,
            isExecuted: observable,
            setAvailable: action,
            setExecuted: action,
        });

        this.id = options.id ?? v4();
        this.name = options.name;
        this.key = options.key ?? this.id;
        this.icon =
            options.icon || options.icon?.length ? options.icon : unknownApp;
        this.isVisibleInStartMenu = options.isVisibleInStartMenu ?? true;
        this.isFullscreen = options.isFullscreen ?? false;
        this.place = options.place ?? ApplicationPlace.Unknown;
        this.isOnlyAdmin = options.isOnlyAdmin ?? false;
        this.isExistedAppInstance = options.isExistedAppInstance ?? false;
    }

    setAvailable(value: boolean) {
        this.isAvailable = value;
    }

    setExecuted(value: boolean) {
        this.isExecuted = value;
    }
}
