import { ITilePreset } from "models/tile/ITilePreset";
import { TileCell } from "models/tile/TileCell";
import { TilePreset } from "models/tile/TilePreset";

export class TileFactory {
    static createTilePreset(options: ITilePreset) {
        return new TilePreset({
            columns: options.columns,
            rows: options.rows,
            alias: options.alias,
            cells: options.cells.map(
                (cell) =>
                    new TileCell({
                        startRow: cell.startRow,
                        startColumn: cell.startColumn,
                        endRow: cell.endRow,
                        endColumn: cell.endColumn,
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
            isEmptyPreset: true,
        });
    }
}
