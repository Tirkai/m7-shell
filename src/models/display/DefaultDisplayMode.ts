import { IDisplayMode } from "interfaces/display/IDisplayMode";

export class DefaultDisplayMode implements IDisplayMode {
    showNotificationToasts = true;
    taskbarVisible = true;
    showAppWindowHeader = true;
}
