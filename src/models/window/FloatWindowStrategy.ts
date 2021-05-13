import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { ApplicationWindow } from "./ApplicationWindow";
import { ApplicationWindowType } from "./ApplicationWindowType";
import { IWindowInstantiateStrategy } from "./IWindowInstantiateStrategy";

export class FloatWindowStrategy implements IWindowInstantiateStrategy {
    instantiate(viewport: VirtualViewportModel) {
        return new ApplicationWindow({
            type: ApplicationWindowType.Float,
            viewport,
        });
    }
}
