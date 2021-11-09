import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";

export interface IApplicationWindow {
    id: string;
    viewport: VirtualViewportModel;
    isFocused: boolean;
    setFocused: (value: boolean) => void;
    isDragging: boolean;
    setViewport: (viewport: VirtualViewportModel) => void;
    depthIndex: number;
    setDepthIndex: (value: number) => void;
    setDragging: (value: boolean) => void;
    x: number;
    y: number;
    setPosition: (x: number, y: number) => void;
}
