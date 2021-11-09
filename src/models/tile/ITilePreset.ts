import { ITileCell } from "./ITileCell";

export interface ITilePreset {
    id: string;
    cells: ITileCell[];
    rows: number;
    columns: number;
    alias: string;
    isEmptyPreset?: boolean;
}
