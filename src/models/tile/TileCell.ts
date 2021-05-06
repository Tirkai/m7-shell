import { makeAutoObservable } from "mobx";
import { IApplicationWindow } from "models/window/IApplicationWindow";
import { v4 } from "uuid";
import { ITileCell } from "./ITileCell";

interface ITileCellOptions {
    area: string;
}

export class TileCell implements ITileCell {
    id: string;
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;

    area: string;

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
        this.area = options.area;
    }

    setSize(width: number, height: number) {
        this.width = Math.floor(width);
        this.height = Math.floor(height);
    }

    setPosition(x: number, y: number) {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
    }
}
