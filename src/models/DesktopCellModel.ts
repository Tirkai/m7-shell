import { makeAutoObservable } from "mobx";
import { v4 } from "uuid";

export class DesktopCellModel {
    id: string;
    column: number;
    row: number;
    isActive: boolean;

    constructor(column: number, row: number, isActive: boolean = false) {
        this.id = v4();
        this.column = column;
        this.row = row;
        this.isActive = isActive;
        makeAutoObservable(this);
    }

    setActive(value: boolean) {
        this.isActive = value;
    }
}
