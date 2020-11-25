import { TASKBAR_HEIGHT } from "constants/config";
import { ResizeHandleDirection } from "enum/ResizeHandleDirection";
import { IDisplayMode } from "interfaces/display/IDisplayMode";
import { IPinArea } from "interfaces/window/IPinArea";
import { makeAutoObservable } from "mobx";
import { ResizeHandle } from "react-resizable";
import { Application } from "./Application";
import { DefaultDisplayMode } from "./DefaultDisplayMode";

interface IApplicationWindowOptions {
    id: string;
    width: number;
    height: number;
    isFullscreen?: boolean;
    dispayMode?: IDisplayMode;
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
    displayMode: IDisplayMode;
    resizeOriginPoint: { x: number; y: number } = { x: 0, y: 0 };
    lockedWidth: number;
    lockedHeight: number;
    lockedX: number;
    lockedY: number;
    isDragging: boolean = false;
    isResizing: boolean = false;

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
                : window.innerHeight - this.displayMode.taskbarOffset + 1,
        };
    }

    constructor(app: Application, options: IApplicationWindowOptions) {
        makeAutoObservable(this);

        this.application = app;
        this.id = options.id;

        const [width, height] = this.getSizeWithBounds(
            options.width,
            options.height,
        );

        this.width = width;
        this.height = height;

        this.x = Math.floor(window.innerWidth / 2 - this.width / 2);
        this.y = Math.floor(
            window.innerHeight / 2 - this.height / 2 - TASKBAR_HEIGHT / 2,
        );
        this.isFullScreen = options.isFullscreen ?? false;
        this.lockedWidth = this.width;
        this.lockedHeight = this.height;
        this.lockedX = this.x;
        this.lockedY = this.y;
        this.displayMode = options.dispayMode ?? new DefaultDisplayMode();
    }

    setResizing(value: boolean) {
        this.isResizing = value;
    }

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

    setPosition(x: number, y: number) {
        this.x = Math.floor(x);
        this.y = Math.floor(y);
    }

    setSize(width: number, height: number) {
        const [w, h] = this.getSizeWithBounds(width, height);
        this.width = Math.floor(w);
        this.height = Math.floor(h);
    }

    setResizeOriginPoint(x: number, y: number) {
        this.resizeOriginPoint = { x, y };
        this.lockedWidth = this.width;
        this.lockedHeight = this.height;
        this.lockedX = this.x;
        this.lockedY = this.y;
    }

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

    setDepthIndex(value: number) {
        this.depthIndex = value;
    }

    setFocused(value: boolean) {
        this.isFocused = value;
    }

    setFullScreen(value: boolean) {
        this.isFullScreen = value;
    }

    setCollapsed(value: boolean) {
        this.isFocused = false;
        this.isCollapsed = value;
    }

    setPinArea(area: IPinArea | null) {
        this.pinArea = area;
    }

    setDispayMode(mode: IDisplayMode) {
        this.displayMode = mode;
    }

    recalculateFullScreenSize() {
        this.isFullScreen = false;
        this.isFullScreen = true;
    }

    private getSizeWithBounds(width: number, height: number) {
        const resultWidth =
            width < window.innerWidth ? width : window.innerWidth;
        const resultHeight =
            height < window.innerHeight - TASKBAR_HEIGHT
                ? height
                : window.innerHeight - TASKBAR_HEIGHT;
        return [resultWidth, resultHeight];
    }
}
