import { ITileCell } from "./ITileCell";

export interface ITilePreset {
    cells: ITileCell[];
    rows: number;
    columns: number;
    alias: string;
    isEmptyPreset?: boolean;
}
