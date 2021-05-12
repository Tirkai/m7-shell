import { IWindowInstantiateStrategy } from "models/window/IWindowInstantiateStrategy";

interface IDisplayModeOptions {
    windowStrategy: IWindowInstantiateStrategy;
    enableTileAttachArea?: boolean;
}

export class DisplayMode {
    windowStrategy: IWindowInstantiateStrategy;
    enableTileAttach: boolean;

    constructor(options: IDisplayModeOptions) {
        this.windowStrategy = options.windowStrategy;
        this.enableTileAttach = options.enableTileAttachArea ?? false;
    }
}
