import { IApplicationWindowOptions } from "interfaces/window/IApplicationWindowOptions";
import { ApplicationWindow } from "models/window/ApplicationWindow";

export class WindowFactory {
    static createWindow(options: IApplicationWindowOptions) {
        const viewport = options.viewport;

        let offsetIndex = 0;
        if (viewport) {
            viewport.setCounter(viewport.counter + 1);
            offsetIndex = viewport.counter;
        }

        return new ApplicationWindow({
            ...options,
            ...{ offsetIndex },
        });
    }
}
