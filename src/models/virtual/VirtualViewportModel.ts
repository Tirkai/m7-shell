import { makeAutoObservable } from "mobx";
import { DisplayMode } from "models/display/DisplayMode";
import { TilePreset } from "models/tile/TilePreset";
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
    displayMode?: DisplayMode;
    counter: number = 0;

    tilePreset?: TilePreset;

    constructor(options?: IVirtualViewportOptions) {
        this.id = options?.id ?? v4();
        this.index = options?.index ?? 0;
        this.tilePreset = options?.tilePreset;
        makeAutoObservable(this);

        this.displayMode = options?.displayMode;
    }

    setTilePreset(preset: TilePreset) {
        this.tilePreset = preset;
    }

    setDisplayMode(displayMode: DisplayMode) {
        this.displayMode = displayMode;
    }

    setIndex(value: number) {
        this.index = value;
    }

    setCounter(value: number) {
        const resetCounterValue = 10;
        if (this.counter <= resetCounterValue) {
            this.counter = value;
        } else {
            this.counter = 0;
        }
    }
}
