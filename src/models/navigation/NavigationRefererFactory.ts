import { ApplicationProcess } from "models/process/ApplicationProcess";
import { NavigationReferer } from "./NavigationReferer";

export class NavigationRefererFactory {
    static createReferer(
        targetProcess: ApplicationProcess,
        sourceProcess?: ApplicationProcess,
    ) {
        if (sourceProcess) {
            return new NavigationReferer({
                refererName: sourceProcess.app.name,
                refererProcessId: sourceProcess.id,
                refererWindowId: sourceProcess.window.id,
                currentProcessId: targetProcess.id,
            });
        }
        return undefined;
    }
}
