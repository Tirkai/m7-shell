import { IWindowInstantiateStrategy } from "models/window/IWindowInstantiateStrategy";

interface IDisplayModeOptions {
    windowStrategy: IWindowInstantiateStrategy;
}

export class DisplayMode {
    windowInstantiateStrategy: IWindowInstantiateStrategy;

    constructor(options: IDisplayModeOptions) {
        this.windowInstantiateStrategy = options.windowStrategy;
    }
}
