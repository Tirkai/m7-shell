import { TileCell } from "models/tile/TileCell";
import { TilePreset } from "models/tile/TilePreset";

export const registeredTilePresets = [
    new TilePreset({
        columns: 1,
        rows: 1,
        cells: [
            new TileCell({
                startColumn: 1,
                endColumn: 1,
                startRow: 1,
                endRow: 1,
            }),
        ],
    }),
    new TilePreset({
        columns: 2,
        rows: 2,
        cells: [
            new TileCell({
                startColumn: 1,
                endColumn: 2,
                startRow: 1,
                endRow: 3,
            }),
            new TileCell({
                startColumn: 2,
                endColumn: 3,
                startRow: 1,
                endRow: 3,
            }),
        ],
    }),
    new TilePreset({
        columns: 2,
        rows: 2,
        cells: [
            new TileCell({
                startColumn: 1,
                endColumn: 2,
                startRow: 1,
                endRow: 3,
            }),
            new TileCell({
                startColumn: 2,
                endColumn: 3,
                startRow: 1,
                endRow: 2,
            }),
            new TileCell({
                startColumn: 2,
                endColumn: 3,
                startRow: 2,
                endRow: 3,
            }),
        ],
    }),
    new TilePreset({
        columns: 2,
        rows: 2,
        cells: [
            new TileCell({
                startColumn: 1,
                endColumn: 2,
                startRow: 1,
                endRow: 2,
            }),
            new TileCell({
                startColumn: 2,
                endColumn: 3,
                startRow: 1,
                endRow: 2,
            }),
            new TileCell({
                startColumn: 1,
                endColumn: 2,
                startRow: 2,
                endRow: 3,
            }),
            new TileCell({
                startColumn: 2,
                endColumn: 3,
                startRow: 2,
                endRow: 3,
            }),
        ],
    }),
];
