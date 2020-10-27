import { IDisplayMode } from "interfaces/display/IDisplayMode";

export class DefaultDisplayMode implements IDisplayMode {
    showNotificationToasts = true;
    taskbarOffset = 48;
    taskbarVisible = true;
    showAppWindowHeader = true;
}
