import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { ApplicationWindow } from "./ApplicationWindow";

export interface IWindowInstantiateStrategy {
    instantiate: (viewport: VirtualViewportModel) => ApplicationWindow;
}
