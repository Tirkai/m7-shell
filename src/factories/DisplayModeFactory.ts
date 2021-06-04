import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { IWindowInstantiateStrategy } from "models/window/IWindowInstantiateStrategy";

interface IDisplayModeTemplate {
    windowStrategy: IWindowInstantiateStrategy;
}

interface ICreateDisplayModeOptions {
    viewport: VirtualViewportModel;
    template: IDisplayModeTemplate;
}

export class DisplayModeFactory {
    static createDisplayMode(options: ICreateDisplayModeOptions) {
        // return new DisplayMode({
        //     windowStrategy: options.template.windowStrategy,

        // })
        return null;
    }
}
