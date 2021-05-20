import {
    BASE_WINDOW_HEIGHT,
    BASE_WINDOW_WIDTH,
    MIN_WINDOW_HEIGHT,
    MIN_WINDOW_WIDTH,
    TASKBAR_HEIGHT,
} from "constants/config";
import { ResizeHandleDirection } from "enum/ResizeHandleDirection";
import { IAppParams } from "interfaces/app/IAppParams";
import { IApplicationWindowOptions } from "interfaces/window/IApplicationWindowOptions";
import { makeAutoObservable } from "mobx";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { ResizeHandle } from "react-resizable";
import { v4 } from "uuid";
import { ApplicationWindowType } from "./ApplicationWindowType";
import { IApplicationWindow } from "./IApplicationWindow";

export class ApplicationWindow implements IApplicationWindow {
    id: string;
    type: ApplicationWindowType;
    depthIndex: number;
    isFocused: boolean = false;
    isFullScreen: boolean = false;
    isCollapsed: boolean = false;
    width: number = 800;
    height: number = 600;
    x: number;
    y: number;
    resizeOriginPoint: { x: number; y: number } = { x: 0, y: 0 };
    lockedWidth: number;
    lockedHeight: number;
    lockedX: number;
    lockedY: number;
    isDragging: boolean = false;
    isResizing: boolean = false;
    viewport: VirtualViewportModel;
    offsetIndex: number;
    area: string;
    focusAfterInstantiate: boolean;

    get minYPosition() {
        return this.y + this.height - MIN_WINDOW_HEIGHT;
    }

    get minXPosition() {
        return this.x + this.width - MIN_WINDOW_WIDTH;
    }

    get bounds() {
        return {
            x: !this.isFullScreen ? this.x : 0,
            y: !this.isFullScreen ? this.y : 0,
            width: !this.isFullScreen ? this.width : window.innerWidth,
            height: !this.isFullScreen ? this.height : window.innerHeight,
        };
    }

    constructor(options: IApplicationWindowOptions) {
        makeAutoObservable(this);

        this.id = options?.id ?? v4();
        this.type = options.type;
        const [width, height] = this.getSizeWithBounds(
            options?.width ?? BASE_WINDOW_WIDTH,
            options?.height ?? BASE_WINDOW_HEIGHT,
        );

        this.width = width;
        this.height = height;

        this.x = 0;
        this.y = 0;

        this.isFullScreen = false;
        this.lockedWidth = this.width;
        this.lockedHeight = this.height;
        this.lockedX = this.x;
        this.lockedY = this.y;
        this.depthIndex = options.depthIndex ?? 1;
        this.offsetIndex = 0;
        this.focusAfterInstantiate = options.focusAfterInstantiate ?? false;

        this.initialize(options);

        this.area = options.area ?? "auto";

        this.viewport = options?.viewport;
    }

    initialize(options: IApplicationWindowOptions) {
        switch (this.type) {
            case ApplicationWindowType.Float: {
                const [x, y] = this.calculatePosition({ withShuffle: true });

                this.x = x;
                this.y = y;

                this.isFullScreen = options?.isFullscreen ?? false;
                this.lockedWidth = this.width;
                this.lockedHeight = this.height;
                this.lockedX = this.x;
                this.lockedY = this.y;
                this.offsetIndex = options.offsetIndex ?? 0;

                break;
            }
            case ApplicationWindowType.Tile: {
                this.x = 0;
                this.y = 0;
                break;
            }
            default:
                break;
        }
    }

    calculatePosition(options?: { withShuffle: boolean }) {
        const getShuffleModifier = () => Math.ceil(this.offsetIndex * 30);

        const x = 100 + getShuffleModifier();
        const y = 100 + getShuffleModifier();

        return [x, y];
    }

    setResizing(value: boolean) {
        this.isResizing = value;
    }

    setDragging(value: boolean) {
        this.isDragging = value;
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
            if (position.y > 0) {
                this.setPosition(this.x, position.y);
                this.setSize(this.width, this.lockedHeight + deltaY);
            } else {
                this.setPosition(this.x, 0);
                this.setSize(
                    this.width,
                    this.lockedHeight + deltaY - Math.abs(position.y),
                );
            }
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

    setParams(params: IAppParams) {
        this.isFullScreen = params.maximize ?? this.isFullScreen;
        if (this.type === ApplicationWindowType.Float) {
            this.width = params.width ?? this.width;
            this.height = params.height ?? this.height;

            const [x, y] = this.calculatePosition();

            this.x = x;
            this.y = y;
        }
    }

    setViewport(viewport: VirtualViewportModel) {
        this.viewport = viewport;
    }

    setArea(value: string) {
        this.area = value;
    }

    setType(value: ApplicationWindowType) {
        this.type = value;

        this.initialize(this);
    }
}
