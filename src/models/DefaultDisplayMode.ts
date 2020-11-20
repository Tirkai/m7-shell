import { TASKBAR_HEIGHT } from "constants/config";
import { IDisplayMode } from "interfaces/display/IDisplayMode";

export class DefaultDisplayMode implements IDisplayMode {
    showNotificationToasts = true;
    taskbarOffset = TASKBAR_HEIGHT;
    taskbarVisible = true;
    showAppWindowHeader = true;
}
