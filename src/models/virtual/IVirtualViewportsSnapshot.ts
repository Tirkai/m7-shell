import { IVirtualViewportTemplate } from "./IVirtualViewportTemplate";

export interface IVirtualViewportSnapshot {
    viewports: IVirtualViewportTemplate[];
    activeTilePresetAlias: string;
    currentViewportId: string;
}
