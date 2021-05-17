import { TileCell } from "models/tile/TileCell";
import { TilePreset } from "models/tile/TilePreset";
import { TileTemplate } from "models/tile/TileTemplate";

export class TileFactory {
    static createTilePreset(options: TileTemplate) {
        return new TilePreset({
            columns: options.columns,
            rows: options.rows,
            alias: options.alias,
            areas: options.areas,
            cells: options.cells.map(
                (cell) =>
                    new TileCell({
                        area: cell.area,
                    }),
            ),
        });
    }

    static createEmptyPreset() {
        return new TilePreset({
            columns: 0,
            rows: 0,
            alias: "none",
            cells: [],
            areas: "",
            // isEmptyPreset: true,
        });
    }
}
