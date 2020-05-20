import { ResizeHandleDirection } from "enum/ResizeHandleDirection";
import { action, observable } from "mobx";
import { ResizeCallbackData } from "react-resizable";
import { Application } from "./Application";

interface IApplicationWindowOptions {
    id: string;
    width: number;
    height: number;
}

export class ApplicationWindow {
    private minWidth = 300;
    private minHeight = 200;

    id: string;

    application: Application;

    @observable
    depthIndex: number = 1;

    @observable
    isFocused: boolean = false;

    @observable
    width: number;

    @observable
    height: number;

    @observable
    x: number;

    @observable
    y: number;

    @observable
    resizeOriginPoint: { x: number; y: number } = { x: 0, y: 0 };

    @observable
    lockedWidth: number = this.width;

    @observable
    lockedHeight: number = this.height;

    @observable
    lockedX: number = this.x;

    @observable
    lockedY: number = this.y;

    @observable
    isDragging: boolean = false;

    @observable
    isResizing: boolean = false;

    constructor(app: Application, options: IApplicationWindowOptions) {
        this.application = app;
        this.id = options.id;
        this.width = options.width;
        this.height = options.height;
        this.x = window.innerWidth / 2 - this.width / 2;
        this.y = window.innerHeight / 2 - this.height / 2;
    }

    @action
    setResizing(value: boolean) {
        this.isResizing = value;
    }

    @action
    setDragging(value: boolean) {
        this.isDragging = value;
    }

    @action
    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    @action
    setSize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    @action
    setResizeOriginPoint(x: number, y: number) {
        this.resizeOriginPoint = { x, y };
        this.lockedWidth = this.width;
        this.lockedHeight = this.height;
        this.lockedX = this.x;
        this.lockedY = this.y;
    }

    @action
    resize(event: MouseEvent, data: ResizeCallbackData) {
        const handle = data.handle;
        const dir = ResizeHandleDirection;
        const deltaX = this.resizeOriginPoint.x - event.clientX;
        const deltaY = this.resizeOriginPoint.y - event.clientY;
        if (
            handle === dir.East ||
            handle === dir.SouthEast ||
            handle === dir.South
        ) {
            this.setSize(data.size.width, data.size.height);
            return;
        }

        if (handle === dir.West) {
            this.setPosition(event.clientX, this.y);
            this.setSize(this.lockedWidth + deltaX, this.height);
        }
        if (handle === dir.North) {
            this.setPosition(this.x, event.clientY);
            this.setSize(this.width, this.lockedHeight + deltaY);
        }
        if (handle === dir.SouthWest) {
            this.setPosition(event.clientX, this.lockedY);
            this.setSize(this.lockedWidth + deltaX, this.lockedHeight - deltaY);
        }
        if (handle === dir.NorthWest) {
            this.setPosition(event.clientX, event.clientY);
            this.setSize(this.lockedWidth + deltaX, this.lockedHeight + deltaY);
        }
        if (handle === dir.NorthEast) {
            this.setPosition(this.lockedX, event.clientY);
            this.setSize(this.lockedWidth - deltaX, this.lockedHeight + deltaY);
        }
    }

    @action
    setDepthIndex(value: number) {
        this.depthIndex = value;
    }

    @action
    setFocused(value: boolean) {
        this.isFocused = value;
    }
}
