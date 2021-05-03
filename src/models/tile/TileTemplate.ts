import { clone } from "lodash";
import { v4 } from "uuid";
import { ITileCell } from "./ITileCell";
import { ITilePreset } from "./ITilePreset";

interface ITileTemplateOptions {
    cells: ITileCell[];
    rows: number;
    columns: number;
    alias: string;
}

export class TileTemplate {
    id: string;

    cells: ITileCell[] = [];
    rows: number;
    columns: number;

    alias: string;

    constructor(options: ITileTemplateOptions) {
        this.id = v4();
        this.cells = options.cells;
        this.rows = options.rows;
        this.columns = options.columns;
        this.cells = options.cells;
        this.alias = options.alias;
    }

    getRawTemplateData(): ITilePreset {
        return clone(this);
    }
}
