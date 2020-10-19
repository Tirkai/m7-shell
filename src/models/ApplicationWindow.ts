import { TASKBAR_HEIGHT } from "constants/config";
import { ResizeHandleDirection } from "enum/ResizeHandleDirection";
import { IPinArea } from "interfaces/window/IPinArea";
import { action, makeAutoObservable } from "mobx";
import { ResizeHandle } from "react-resizable";
import { Application } from "./Application";

interface IApplicationWindowOptions {
    id: string;
    width: number;
    height: number;
    isFullscreen?: boolean;
}

export class ApplicationWindow {
    id: string;

    application: Application;

    depthIndex: number = 1;

    isFocused: boolean = false;

    isFullScreen: boolean = false;

    isCollapsed: boolean = false;

    width: number = 800;

    height: number = 600;

    x: number;

    y: number;

    pinArea: IPinArea | null = null;

    get minYPosition() {
        return this.y + this.height - this.application.minHeight;
    }

    get minXPosition() {
        return this.x + this.width - this.application.minWidth;
    }

    get bounds() {
        return {
            x: !this.isFullScreen ? this.x : 0,
            y: !this.isFullScreen ? this.y : 0,
            width: !this.isFullScreen ? this.width : window.innerWidth,
            height: !this.isFullScreen
                ? this.height
                : window.innerHeight - TASKBAR_HEIGHT + 1,
        };
    }

    resizeOriginPoint: { x: number; y: number } = { x: 0, y: 0 };

    lockedWidth: number;

    lockedHeight: number;

    lockedX: number;

    lockedY: number;

    isDragging: boolean = false;

    isResizing: boolean = false;

    constructor(app: Application, options: IApplicationWindowOptions) {
        makeAutoObservable(this);

        this.application = app;
        this.id = options.id;
        this.width =
            typeof options.width === "number" ? options.width : app.baseWidth;
        this.height =
            typeof options.height === "number"
                ? options.height
                : app.baseHeight;

        this.x = Math.floor(window.innerWidth / 2 - this.width / 2);
        this.y = Math.floor(window.innerHeight / 2 - this.height / 2);
        this.isFullScreen = options.isFullscreen ?? false;
        this.lockedWidth = this.width;
        this.lockedHeight = this.height;
        this.lockedX = this.x;
        this.lockedY = this.y;
    }

    @action
    setResizing(value: boolean) {
        this.isResizing = value;
    }

    @action
    setDragging(value: boolean) {
        this.isDragging = value;

        if (!this.isDragging && this.pinArea) {
            if (!this.pinArea.isFullscreen) {
                this.setSize(this.pinArea.width, this.pinArea.height);
                this.setPosition(this.pinArea.left, this.pinArea.top);
            } else {
                this.setFullScreen(true);
            }
            this.setPinArea(null);
        }
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

    @action
    setPinArea(area: IPinArea | null) {
        this.pinArea = area;
    }

    @action
    recalculateFullScreenSize() {
        this.isFullScreen = false;
        this.isFullScreen = true;
    }
}
