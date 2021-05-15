import { IApplicationWindowOptions } from "interfaces/window/IApplicationWindowOptions";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import { AppStore } from "stores/AppStore";

export class WindowFactory {
    static createWindow(options: IApplicationWindowOptions, store?: AppStore) {
        const viewport = options.viewport;
        const windowsInViewport = store?.processManager.processes
            .filter((item) => item.window.viewport.id === viewport.id)
            .map((item) => item.window);

        const getOffsetIndex = (index: number) => {
            return index < 10 ? index : 10;
        };

        const offsetIndex = getOffsetIndex(windowsInViewport?.length ?? 0);

        return new ApplicationWindow({
            ...options,
            ...{ offsetIndex },
        });
    }
}
