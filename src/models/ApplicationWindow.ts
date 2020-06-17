import { ResizeHandleDirection } from "enum/ResizeHandleDirection";
import { action, computed, observable } from "mobx";
import { ResizeHandle } from "react-resizable";
import { Application } from "./Application";

interface IApplicationWindowOptions {
    id: string;
    width: number;
    height: number;
}

export class ApplicationWindow {
    id: string;

    application: Application;

    @observable
    depthIndex: number = 1;

    @observable
    isFocused: boolean = false;

    @observable
    isFullScreen: boolean = false;

    @observable
    isCollapsed: boolean = false;

    @observable
    width: number;

    @observable
    height: number;

    @observable
    x: number;

    @observable
    y: number;

    @computed
    get minYPosition() {
        return this.y + this.height - this.application.minHeight;
    }

    @computed
    get minXPosition() {
        return this.x + this.width - this.application.minWidth;
    }

    @computed
    get bounds() {
        const TASKBAR_HEIGHT = 48;
        return {
            x: !this.isFullScreen ? this.x : 0,
            y: !this.isFullScreen ? this.y : 0,
            width: !this.isFullScreen ? this.width : window.innerWidth,
            height: !this.isFullScreen
                ? this.height
                : window.innerHeight - TASKBAR_HEIGHT,
        };
    }

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
        this.x = Math.floor(window.innerWidth / 2 - this.width / 2);
        this.y = Math.floor(window.innerHeight / 2 - this.height / 2);
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
        this.x = Math.floor(x);
        this.y = Math.floor(y);
    }

    @action
    setSize(width: number, height: number) {
        this.width = Math.floor(width);
        this.height = Math.floor(height);
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
    resize(
        handle: ResizeHandle,
        position: { x: number; y: number },
        size: { width: number; height: number },
    ) {
        // const handle = data.handle;
        const dir = ResizeHandleDirection;
        const deltaX = this.resizeOriginPoint.x - position.x;
        const deltaY = this.resizeOriginPoint.y - position.y;
        if (
            handle === dir.East ||
            handle === dir.SouthEast ||
            handle === dir.South
        ) {
            this.setSize(size.width, size.height);
            return;
        }

        if (handle === dir.West) {
            this.setPosition(position.x, this.y);
            this.setSize(this.lockedWidth + deltaX, this.height);
        }
        if (handle === dir.North) {
            this.setPosition(this.x, position.y);
            this.setSize(this.width, this.lockedHeight + deltaY);
        }
        if (handle === dir.SouthWest) {
            this.setPosition(position.x, this.lockedY);
            this.setSize(this.lockedWidth + deltaX, this.lockedHeight - deltaY);
        }
        if (handle === dir.NorthWest) {
            this.setPosition(position.x, position.y);
            this.setSize(this.lockedWidth + deltaX, this.lockedHeight + deltaY);
        }
        if (handle === dir.NorthEast) {
            this.setPosition(this.lockedX, position.y);
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

    @action
    setFullScreen(value: boolean) {
        this.isFullScreen = value;
    }

    @action
    setCollapsed(value: boolean) {
        this.isFocused = false;
        this.isCollapsed = value;
    }
}
