import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { ApplicationWindowType } from "models/window/ApplicationWindowType";

export interface IApplicationWindowOptions {
    id?: string;
    type?: ApplicationWindowType;
    width?: number;
    height?: number;
    isFullscreen?: boolean;
    x?: number;
    y?: number;
    viewport?: VirtualViewportModel;
    area?: string;
    depthIndex?: number;
    offsetIndex?: number;
    focusAfterInstantiate?: boolean;
}
