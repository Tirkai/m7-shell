import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { ApplicationWindow } from "./ApplicationWindow";

export interface IWindowInstantiateStrategy {
    viewport: VirtualViewportModel;
    instantiate: (viewport: VirtualViewportModel) => ApplicationWindow;
}
