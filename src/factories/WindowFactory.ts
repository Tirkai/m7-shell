import { IApplicationWindowOptions } from "interfaces/window/IApplicationWindowOptions";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import { AppStore } from "stores/AppStore";

export class WindowFactory {
    static createWindow(options: IApplicationWindowOptions, store?: AppStore) {
        const viewport = options.viewport;

        viewport.setCounter(viewport.counter + 1);

        const offsetIndex = viewport.counter;

        return new ApplicationWindow({
            ...options,
            ...{ offsetIndex },
        });
    }
}
