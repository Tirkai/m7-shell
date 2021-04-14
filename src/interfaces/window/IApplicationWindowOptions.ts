import { IDisplayMode } from "interfaces/display/IDisplayMode";

export interface IApplicationWindowOptions {
    id?: string;
    width?: number;
    height?: number;
    isFullscreen?: boolean;
    displayMode?: IDisplayMode;
}
