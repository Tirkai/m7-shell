import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { ApplicationWindow } from "./ApplicationWindow";
import { ApplicationWindowType } from "./ApplicationWindowType";
import { IWindowInstantiateStrategy } from "./IWindowInstantiateStrategy";

interface ITileWindowStrategyOptions {
    viewport: VirtualViewportModel;
}

export class TileWindowStrategy implements IWindowInstantiateStrategy {
    viewport: VirtualViewportModel;

    constructor(options: ITileWindowStrategyOptions) {
        this.viewport = options.viewport;
    }

    instantiate(viewport: VirtualViewportModel) {
        return new ApplicationWindow({
            type: ApplicationWindowType.Tile,
            viewport,
        });
    }
}
