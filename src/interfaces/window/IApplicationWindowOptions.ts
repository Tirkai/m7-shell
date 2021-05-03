import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";

export interface IApplicationWindowOptions {
    id?: string;
    width?: number;
    height?: number;
    isFullscreen?: boolean;
    // displayMode?: IDisplayMode;
    x?: number;
    y?: number;
    viewport: VirtualViewportModel;
}
