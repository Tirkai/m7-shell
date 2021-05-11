import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { IApplicationWindow } from "./IApplicationWindow";

export interface IWindowInstantiateStrategy {
    instantiate: (viewport: VirtualViewportModel) => IApplicationWindow;
}
