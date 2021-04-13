import { v4 } from "uuid";

interface IDesktopWidgetOptions {
    id?: string;
    column: number;
    row: number;
}

export class DesktopWidget {
    id: string;
    column: number;
    row: number;

    constructor(options: IDesktopWidgetOptions) {
        this.id = options.id ?? v4();
        this.column = options.column;
        this.row = options.row;
    }
}
