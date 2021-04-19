import { makeAutoObservable } from "mobx";
import { ApplicationWindow } from "models/ApplicationWindow";
import { v4 } from "uuid";
import { TileGridUnit } from "./TileGridUnit";

interface ITileCellOptions {
    startColumn: TileGridUnit;
    endColumn: TileGridUnit;
    startRow: TileGridUnit;
    endRow: TileGridUnit;
}

export class TileCell {
    id: string;
    startColumn: TileGridUnit = "span";
    endColumn: TileGridUnit = "span";
    startRow: TileGridUnit = "span";
    endRow: TileGridUnit = "span";

    appWindow: ApplicationWindow | null = null;

    get hasWindow() {
        return this.appWindow !== null;
    }

    setAppWindow(appWindow: ApplicationWindow | null) {
        this.appWindow = appWindow;
    }

    constructor(options: ITileCellOptions) {
        makeAutoObservable(this);

        this.id = v4();
        this.startColumn = options.startColumn;
        this.endColumn = options.endColumn;
        this.startRow = options.startRow;
        this.endRow = options.endRow;
    }
}
