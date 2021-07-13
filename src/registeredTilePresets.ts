import { TileTemplate } from "models/tile/TileTemplate";
import { v4 } from "uuid";

export const registeredTileTemplates: TileTemplate[] = [
    new TileTemplate({
        columns: 1,
        rows: 1,
        alias: "1x1",
        areas: `"a"`,
        cells: [
            {
                id: v4(),
                area: "a",
            },
        ],
    }),
    new TileTemplate({
        columns: 2,
        rows: 2,
        alias: "1x2-1x2",
        areas: `
            "a b"
            "a b"
        `,
        cells: [
            {
                id: v4(),
                area: "a",
            },
            {
                id: v4(),
                area: "b",
            },
        ],
    }),
    new TileTemplate({
        columns: 2,
        rows: 2,
        alias: "1x2-1x1-1x1",
        areas: `
            "a b"
            "a c"
        `,
        cells: [
            {
                id: v4(),
                area: "a",
            },
            {
                id: v4(),
                area: "b",
            },
            {
                id: v4(),
                area: "c",
            },
        ],
    }),
    new TileTemplate({
        columns: 2,
        rows: 2,
        alias: "1x1-1x1-1x1-1x1",
        areas: `
            "a b"
            "c d"
        `,
        cells: [
            {
                id: v4(),
                area: "a",
            },
            {
                id: v4(),
                area: "b",
            },
            {
                id: v4(),
                area: "c",
            },
            {
                id: v4(),
                area: "d",
            },
        ],
    }),
];
