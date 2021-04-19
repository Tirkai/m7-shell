import { makeAutoObservable } from "mobx";
import { v4 } from "uuid";
import { TileCell } from "./TileCell";

interface ITilePresetOptions {
    cells: TileCell[];
    rows: number;
    columns: number;
}

export class TilePreset {
    id: string;

    cells: TileCell[] = [];
    rows: number;
    columns: number;

    // tiles: TileArea[] = [];

    get maxTilesCount() {
        return this.cells.length;
    }

    constructor(options: ITilePresetOptions) {
        makeAutoObservable(this);

        this.id = v4();
        this.cells = options.cells;
        this.rows = options.rows;
        this.columns = options.columns;
        this.cells = options.cells;
    }

    setCells(cells: TileCell[]) {
        this.cells = cells;
    }

    // setTiles(tiles: TileArea[]) {
    //     this.tiles = tiles;
    // }
}
