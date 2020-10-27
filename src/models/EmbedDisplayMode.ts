import { IDisplayMode } from "interfaces/display/IDisplayMode";

export class EmbedDisplayMode implements IDisplayMode {
    showNotificationToasts = false;
    taskbarOffset = 0;
    taskbarVisible = false;
    showAppWindowHeader = false;
}
