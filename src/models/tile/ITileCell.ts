import { TileGridUnit } from "./TileGridUnit";

export interface ITileCell {
    startColumn: TileGridUnit;
    endColumn: TileGridUnit;
    startRow: TileGridUnit;
    endRow: TileGridUnit;
}
