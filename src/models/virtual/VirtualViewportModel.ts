import { makeAutoObservable } from "mobx";
import { DisplayMode } from "models/display/DisplayMode";
import { TilePreset } from "models/tile/TilePreset";
import { v4 } from "uuid";
import { IVirtualViewportState } from "./IVirtualViewportState";
import { ViewportDefaultState } from "./ViewportDefaultState";

interface IVirtualViewportOptions {
    id?: string;
    index?: number;
    tilePreset?: TilePreset;
    displayMode?: DisplayMode;
    state?: IVirtualViewportState;
    key?: string;
}

export class VirtualViewportModel {
    id: string = v4();
    index: number;
    displayMode?: DisplayMode;
    counter: number = 0;
    hash: string = v4();
    state: IVirtualViewportState;
    key: string;

    tilePreset?: TilePreset;

    constructor(options?: IVirtualViewportOptions) {
        this.id = options?.id ?? v4();
        this.index = options?.index ?? 0;
        this.tilePreset = options?.tilePreset;
        this.state = options?.state ?? new ViewportDefaultState();
        this.key = options?.key ?? v4();
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
