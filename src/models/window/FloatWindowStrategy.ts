import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { ApplicationWindow } from "./ApplicationWindow";
import { ApplicationWindowType } from "./ApplicationWindowType";
import { IWindowInstantiateStrategy } from "./IWindowInstantiateStrategy";

interface IFloatWindowStrategyOptions {
    viewport: VirtualViewportModel;
}

export class FloatWindowStrategy implements IWindowInstantiateStrategy {
    viewport: VirtualViewportModel;

    constructor(options: IFloatWindowStrategyOptions) {
        this.viewport = options.viewport;
    }

    instantiate(viewport: VirtualViewportModel) {
        return new ApplicationWindow({
            type: ApplicationWindowType.Float,
            viewport,
        });
    }
}
