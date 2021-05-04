import { makeAutoObservable } from "mobx";
import { IApplicationWindow } from "models/window/IApplicationWindow";
import { v4 } from "uuid";
import { ITileCell } from "./ITileCell";
import { TileGridUnit } from "./TileGridUnit";

interface ITileCellOptions {
    startColumn: TileGridUnit;
    endColumn: TileGridUnit;
    startRow: TileGridUnit;
    endRow: TileGridUnit;
}

export class TileCell implements ITileCell {
    id: string;
    startColumn: TileGridUnit = "span";
    endColumn: TileGridUnit = "span";
    startRow: TileGridUnit = "span";
    endRow: TileGridUnit = "span";
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;

    draggedAppWindow: IApplicationWindow | null = null;

    attachedAppWindow: IApplicationWindow | null = null;

    get hasDraggedWindow() {
        return this.draggedAppWindow !== null;
    }

    get hasAttachedWindow() {
        return this.attachedAppWindow !== null;
    }

    appWindowListenersIds: string[] = [];

    setDraggedAppWindow(appWindow: IApplicationWindow | null) {
        this.draggedAppWindow = appWindow;
    }

    setAttachedAppWindow(appWindow: IApplicationWindow | null) {
        this.attachedAppWindow = appWindow;
    }

    constructor(options: ITileCellOptions) {
        makeAutoObservable(this);

        this.id = v4();
        this.startColumn = options.startColumn;
        this.endColumn = options.endColumn;
        this.startRow = options.startRow;
        this.endRow = options.endRow;
    }

    setSize(width: number, height: number) {
        this.width = Math.floor(width);
        this.height = Math.floor(height);
        if (this.attachedAppWindow) {
            // TODO: FIX
            // this.attachedAppWindow.setSize(this.width, this.height);
        }
    }

    setPosition(x: number, y: number) {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        if (this.attachedAppWindow) {
            // TODO: FIX
            // this.attachedAppWindow.setPosition(this.x, this.y);
        }
    }
}
