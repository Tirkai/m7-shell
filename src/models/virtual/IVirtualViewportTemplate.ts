import { DisplayModeType } from "models/display/DisplayModeType";

export interface IVirtualViewportTemplate {
    viewportId: string;
    templateAlias: string;
    displayModeType: DisplayModeType;
}
