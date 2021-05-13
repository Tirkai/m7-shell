import { ApplicationWindowType } from "models/window/ApplicationWindowType";
import { v4 } from "uuid";
import { DisplayModeType } from "./DisplayModeType";

interface IDisplayModeOptions {
    id?: string;
    type: DisplayModeType;
    windowType: ApplicationWindowType;
    // windowStrategy: IWindowInstantiateStrategy;
    enableTileAttachArea?: boolean;
}

export class DisplayMode {
    id: string;
    type: DisplayModeType;
    // windowStrategy: IWindowInstantiateStrategy;
    windowType: ApplicationWindowType;

    enableTileAttach: boolean;

    constructor(options: IDisplayModeOptions) {
        this.id = options.id ?? v4();
        this.type = options.type;
        this.windowType = options.windowType;
        // this.windowStrategy = options.windowStrategy;
        this.enableTileAttach = options.enableTileAttachArea ?? false;
    }
}
