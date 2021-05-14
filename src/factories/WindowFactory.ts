import { IApplicationWindowOptions } from "interfaces/window/IApplicationWindowOptions";
import { max } from "lodash";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import { AppStore } from "stores/AppStore";

export class WindowFactory {
    static createWindow(options: IApplicationWindowOptions, store?: AppStore) {
        const viewport = options.viewport;
        const windowsInViewport = store?.processManager.processes
            .filter((item) => item.window.viewport.id === viewport.id)
            .map((item) => item.window);

        const maxDepthIndex = max(
            windowsInViewport?.map((item) => item.depthIndex),
        );

        return new ApplicationWindow({
            ...options,
            ...{ depthIndex: maxDepthIndex ? maxDepthIndex + 1 : 1 },
        });
    }
}
