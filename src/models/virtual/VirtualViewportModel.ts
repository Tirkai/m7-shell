import { TileFactory } from "factories/TileFactory";
import { makeAutoObservable } from "mobx";
import { DisplayMode } from "models/display/DisplayMode";
import { DisplayModeType } from "models/display/DisplayModeType";
import { TilePreset } from "models/tile/TilePreset";
import { ApplicationWindowType } from "models/window/ApplicationWindowType";
import { v4 } from "uuid";

interface IVirtualViewportOptions {
    id?: string;
    index?: number;
    tilePreset?: TilePreset;
    displayMode?: DisplayMode;
}

export class VirtualViewportModel {
    id: string = v4();
    index: number;
    displayMode: DisplayMode;

    tilePreset: TilePreset;

    constructor(options?: IVirtualViewportOptions) {
        this.id = options?.id ?? v4();
        this.index = options?.index ?? 0;
        this.tilePreset =
            options?.tilePreset ?? TileFactory.createEmptyPreset();
        makeAutoObservable(this);

        this.displayMode =
            options?.displayMode ??
            new DisplayMode({
                type: DisplayModeType.Tile,
                windowType: ApplicationWindowType.Tile,
                enableTileAttachArea: true,
            });
    }

    setTilePreset(preset: TilePreset) {
        this.tilePreset = preset;
    }

    setDisplayMode(displayMode: DisplayMode) {
        this.displayMode = displayMode;
    }
}
