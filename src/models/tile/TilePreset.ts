import { ITilePresetOptions } from "interfaces/tile/ITilePresetOptions";
import { makeAutoObservable } from "mobx";
import { v4 } from "uuid";
import { ITilePreset } from "./ITilePreset";
import { TileCell } from "./TileCell";

export class TilePreset implements ITilePreset {
    id: string;

    cells: TileCell[] = [];
    rows: number;
    columns: number;

    alias: string;

    areas: string;

    get isEmptyPreset() {
        return this.cells.every((item) => item.attachedAppWindow === null);
    }

    get freeCells() {
        return this.cells.filter((item) => !item.hasAttachedWindow) ?? [];
    }

    get hasFreeCells() {
        return this.freeCells.length > 0;
    }

    get maxTilesCount() {
        return this.cells.length;
    }

    get nearbyFreeCell() {
        return this.freeCells[0] ?? null;
    }

    constructor(options: ITilePresetOptions) {
        makeAutoObservable(this);

        this.id = v4();
        this.cells = options.cells;
        this.rows = options.rows;
        this.columns = options.columns;
        this.cells = options.cells;
        this.alias = options.alias;
        // this.isEmptyPreset = options.isEmptyPreset ?? false;
        this.areas = options.areas;
    }

    setCells(cells: TileCell[]) {
        this.cells = cells;
    }
}
