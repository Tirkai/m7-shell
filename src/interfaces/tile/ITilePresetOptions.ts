import { TileCell } from "models/tile/TileCell";

export interface ITilePresetOptions {
    cells: TileCell[];
    rows: number;
    columns: number;
    alias: string;
    isEmptyPreset?: boolean;
}
