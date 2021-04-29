import { TileFactory } from "factories/TileFactory";
import { ITilePreset } from "models/tile/ITilePreset";

const rawTilePresets: ITilePreset[] = [
    {
        columns: 1,
        rows: 1,
        alias: "1x1",
        cells: [
            {
                startColumn: 1,
                endColumn: 1,
                startRow: 1,
                endRow: 1,
            },
        ],
    },
    {
        columns: 2,
        rows: 2,
        alias: "1x2-1x2",
        cells: [
            {
                startColumn: 1,
                endColumn: 2,
                startRow: 1,
                endRow: 3,
            },
            {
                startColumn: 2,
                endColumn: 3,
                startRow: 1,
                endRow: 3,
            },
        ],
    },
    {
        columns: 2,
        rows: 2,
        alias: "1x2-1x1-1x1",
        cells: [
            {
                startColumn: 1,
                endColumn: 2,
                startRow: 1,
                endRow: 3,
            },
            {
                startColumn: 2,
                endColumn: 3,
                startRow: 1,
                endRow: 2,
            },
            {
                startColumn: 2,
                endColumn: 3,
                startRow: 2,
                endRow: 3,
            },
        ],
    },
    {
        columns: 2,
        rows: 2,
        alias: "1x1-1x1-1x1-1x1",
        cells: [
            {
                startColumn: 1,
                endColumn: 2,
                startRow: 1,
                endRow: 2,
            },
            {
                startColumn: 2,
                endColumn: 3,
                startRow: 1,
                endRow: 2,
            },
            {
                startColumn: 1,
                endColumn: 2,
                startRow: 2,
                endRow: 3,
            },
            {
                startColumn: 2,
                endColumn: 3,
                startRow: 2,
                endRow: 3,
            },
        ],
    },
];

export const registeredTilePresets = rawTilePresets.map((preset) =>
    TileFactory.createTilePreset(preset),
);
