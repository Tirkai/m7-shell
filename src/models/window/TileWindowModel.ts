import { makeAutoObservable } from "mobx";
import { TileGridUnit } from "models/tile/TileGridUnit";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { v4 } from "uuid";
import { IApplicationWindow } from "./IApplicationWindow";

interface ITileWindowModelOptions {
    id?: string;
    viewport: VirtualViewportModel;
    area?: string;
}

export class TileWindowModel implements IApplicationWindow {
    id: string;
    viewport: VirtualViewportModel;
    isFocused: boolean;
    isDragging: boolean;
    depthIndex: number;
    startColumn: TileGridUnit;
    endColumn: TileGridUnit;
    startRow: TileGridUnit;
    endRow: TileGridUnit;
    area: string;
    x: number;
    y: number;

    constructor(options: ITileWindowModelOptions) {
        this.id = options.id ?? v4();
        this.viewport = options.viewport;
        this.isFocused = false;
        this.isDragging = false;
        this.depthIndex = 1;
        this.startColumn = 1;
        this.endColumn = 1;
        this.startRow = 1;
        this.endRow = 1;
        this.area = options.area ?? "a";
        this.x = 0;
        this.y = 0;
        makeAutoObservable(this);
    }

    setFocused(value: boolean) {
        this.isFocused = value;
    }

    setDragging(value: boolean) {
        this.isDragging = value;
    }

    setDepthIndex(value: number) {
        this.depthIndex = value;
    }

    setViewport(viewport: VirtualViewportModel) {
        this.viewport = viewport;
    }

    setGrid(grid: {
        startColumn: TileGridUnit;
        endColumn: TileGridUnit;
        startRow: TileGridUnit;
        endRow: TileGridUnit;
    }) {
        this.startColumn = grid.startColumn;
        this.endColumn = grid.endColumn;
        this.startRow = grid.startRow;
        this.endRow = grid.endRow;
    }

    setArea(area: string) {
        this.area = area;
    }

    setPosition(x: number, y: number) {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
    }
}
