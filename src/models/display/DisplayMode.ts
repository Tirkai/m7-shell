import { IWindowInstantiateStrategy } from "models/window/IWindowInstantiateStrategy";

interface IDisplayModeOptions {
    windowStrategy: IWindowInstantiateStrategy;
    enableTiles?: boolean;
}

export class DisplayMode {
    windowInstantiateStrategy: IWindowInstantiateStrategy;
    enableTiles: boolean;

    constructor(options: IDisplayModeOptions) {
        this.windowInstantiateStrategy = options.windowStrategy;
        this.enableTiles = options.enableTiles ?? false;
    }
}
