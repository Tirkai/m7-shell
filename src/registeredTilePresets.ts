import { TileTemplate } from "models/tile/TileTemplate";
import { v4 } from "uuid";

export const registeredTileTemplates: TileTemplate[] = [
    new TileTemplate({
        columns: 0,
        rows: 0,
        alias: "none",
        cells: [],
    }),
    new TileTemplate({
        columns: 1,
        rows: 1,
        alias: "1x1",
        cells: [
            {
                id: v4(),
                startColumn: 1,
                endColumn: 1,
                startRow: 1,
                endRow: 1,
            },
        ],
    }),
    new TileTemplate({
        columns: 2,
        rows: 2,
        alias: "1x2-1x2",
        cells: [
            {
                id: v4(),

                startColumn: 1,
                endColumn: 2,
                startRow: 1,
                endRow: 3,
            },
            {
                id: v4(),

                startColumn: 2,
                endColumn: 3,
                startRow: 1,
                endRow: 3,
            },
        ],
    }),
    new TileTemplate({
        columns: 2,
        rows: 2,
        alias: "1x2-1x1-1x1",
        cells: [
            {
                id: v4(),

                startColumn: 1,
                endColumn: 2,
                startRow: 1,
                endRow: 3,
            },
            {
                id: v4(),

                startColumn: 2,
                endColumn: 3,
                startRow: 1,
                endRow: 2,
            },
            {
                id: v4(),

                startColumn: 2,
                endColumn: 3,
                startRow: 2,
                endRow: 3,
            },
        ],
    }),
    new TileTemplate({
        columns: 2,
        rows: 2,
        alias: "1x1-1x1-1x1-1x1",
        cells: [
            {
                id: v4(),

                startColumn: 1,
                endColumn: 2,
                startRow: 1,
                endRow: 2,
            },
            {
                id: v4(),

                startColumn: 2,
                endColumn: 3,
                startRow: 1,
                endRow: 2,
            },
            {
                id: v4(),

                startColumn: 1,
                endColumn: 2,
                startRow: 2,
                endRow: 3,
            },
            {
                id: v4(),

                startColumn: 2,
                endColumn: 3,
                startRow: 2,
                endRow: 3,
            },
        ],
    }),
];
