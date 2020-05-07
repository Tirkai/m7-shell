import { action, observable } from "mobx";
import { Application } from "./Application";

interface IApplicationWindowOptions {
    width: number;
    height: number;
}

export class ApplicationWindow {
    application: Application;
    width: number;
    height: number;

    @observable
    isDragging: boolean = false;

    @observable
    isResizing: boolean = false;

    constructor(app: Application, options: IApplicationWindowOptions) {
        this.application = app;
        this.width = options.width;
        this.height = options.height;
    }

    @action
    setResizing(value: boolean) {
        console.log("set resizing", value);
        this.isResizing = value;
    }

    @action
    setDragging(value: boolean) {
        this.isDragging = value;
    }
}
