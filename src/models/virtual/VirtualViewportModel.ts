import { TileFactory } from "factories/TileFactory";
import { makeAutoObservable } from "mobx";
import { TilePreset } from "models/tile/TilePreset";
import { v4 } from "uuid";

interface IVirtualViewportOptions {
    id?: string;
    index?: number;
    tilePreset?: TilePreset;
}

export class VirtualViewportModel {
    id: string = v4();
    index: number;

    tilePreset: TilePreset;

    constructor(options?: IVirtualViewportOptions) {
        this.id = options?.id ?? v4();
        this.index = options?.index ?? 0;
        this.tilePreset =
            options?.tilePreset ?? TileFactory.createEmptyPreset();
        makeAutoObservable(this);
    }

    setTilePreset(preset: TilePreset) {
        this.tilePreset = preset;
    }
}
