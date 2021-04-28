import { makeAutoObservable } from "mobx";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import { v4 } from "uuid";

interface IVirtualViewportOptions {
    id?: string;
    index?: number;
}

export class VirtualViewportModel {
    id: string = v4();
    index: number;

    windows: ApplicationWindow[] = [];

    setWindows(windows: ApplicationWindow[]) {
        this.windows = windows;
    }

    addWindow(appWindow: ApplicationWindow) {
        this.windows.push(appWindow);
    }

    removeWindow(appWindow: ApplicationWindow) {
        const index = this.windows.indexOf(appWindow);
        this.windows.splice(index, 1);
    }

    constructor(options?: IVirtualViewportOptions) {
        this.id = options?.id ?? v4();
        this.index = options?.index ?? 0;

        makeAutoObservable(this);
    }
}
