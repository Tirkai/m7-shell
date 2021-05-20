import { ApplicationWindowType } from "models/window/ApplicationWindowType";
import { v4 } from "uuid";
import { DisplayModeType } from "./DisplayModeType";

interface IDisplayModeOptions {
    id?: string;
    type: DisplayModeType;
    windowType: ApplicationWindowType;
    enableTileAttachArea?: boolean;
}

export class DisplayMode {
    id: string;
    type: DisplayModeType;
    windowType: ApplicationWindowType;

    enableTileAttach: boolean;

    constructor(options: IDisplayModeOptions) {
        this.id = options.id ?? v4();
        this.type = options.type;
        this.windowType = options.windowType;
        this.enableTileAttach = options.enableTileAttachArea ?? false;
    }
}
