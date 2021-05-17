import { DisplayMode } from "models/display/DisplayMode";
import { DisplayModeType } from "models/display/DisplayModeType";
import { ApplicationWindowType } from "models/window/ApplicationWindowType";

export const registeredDisplayModes = [
    new DisplayMode({
        type: DisplayModeType.Tile,
        windowType: ApplicationWindowType.Tile,
        enableTileAttachArea: true,
    }),
    new DisplayMode({
        type: DisplayModeType.Float,
        windowType: ApplicationWindowType.Float,
        enableTileAttachArea: false,
    }),
];
