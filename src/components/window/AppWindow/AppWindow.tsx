import classNames from "classnames";
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH } from "constants/config";
import { useStore } from "hooks/useStore";
import { ApplicationProcess } from "models/ApplicationProcess";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import React, { useEffect, useState } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";
import { Resizable, ResizeCallbackData, ResizeHandle } from "react-resizable";
import AppLoader from "../AppLoader/AppLoader";
import { AppWindowContent } from "../AppWindowContent/AppWindowContent";
import { AppWindowHeader } from "../AppWindowHeader/AppWindowHeader";
import { AppWindowUnfocusedOverlay } from "../AppWindowUnfocusedOverlay/AppWindowUnfocusedOverlay";
import style from "./style.module.css";

interface IAppWindowProps {
    process: ApplicationProcess;
    window: ApplicationWindow;
    width: number;
    height: number;
    isResizing: boolean;
    isDragging: boolean;
    isFocused: boolean;
    url: string;
    onResizeStart: (event: MouseEvent, data: ResizeCallbackData) => void;
    onResizeStop: () => void;
    onResize: (event: MouseEvent, data: ResizeCallbackData) => void;
    onDragStart: () => void;
    onDragStop: () => void;
    onDrag: DraggableEventHandler;
    onClose: () => void;
}

export const AppWindow = (props: IAppWindowProps) => {
    const store = useStore();
    const [isAppReady, setAppReady] = useState(false);
    const [frame, setFrame] = useState<HTMLIFrameElement | null>(null);
    const [url, setUrl] = useState(props.process.modifiedUrl);

    const handleResizeStart = (
        event: React.SyntheticEvent,
        data: ResizeCallbackData,
    ) => {
        props.onResizeStart((event as unknown) as MouseEvent, data);
    };

    const handleResizeEnd = () => {
        props.onResizeStop();
    };

    const handleResize = (
        event: React.SyntheticEvent,
        eventData: ResizeCallbackData,
    ) => {
        const data = eventData;
        const nativeEvent = (event as unknown) as MouseEvent;

        props.onResize((event as unknown) as MouseEvent, data);
    };

    const handleFocus = () => {
        store.windowManager.focusWindow(props.window);
    };

    const handleFullScreen = () => {
        store.windowManager.applyFullscreenToWindow(
            props.window,
            !props.window.isFullScreen,
        );
    };

    const handleCollapse = () => {
        store.windowManager.applyCollapseToWindow(props.window, true);
    };

    const handleHeaderDoubleClick = () => handleFullScreen();

    const handleReload = () => {
        props.process.rerollHash();
    };

    const handleAppReady = () => {
        setAppReady(true);
    };

    useEffect(() => {
        setUrl(props.process.modifiedUrl);
    }, [props.process.modifiedUrl]);

    const resizeDirections = ["sw", "se", "nw", "ne", "w", "e", "n", "s"];

    const boundsVisibilityPercentModifier = 0.25;
    const boundsInvisibilityPercentModifier = 0.75;

    const topBound = 0;
    const leftBound = -props.width * boundsInvisibilityPercentModifier;
    const rightBound =
        window.innerWidth - props.width * boundsVisibilityPercentModifier;
    const bottomBound =
        window.innerHeight - props.height * boundsVisibilityPercentModifier;

    return (
        <Draggable
            handle=".appHeaderInfoBar"
            onStart={props.onDragStart}
            onStop={props.onDragStop}
            onDrag={props.onDrag}
            position={{
                x: props.window.bounds.x,
                y: props.window.bounds.y,
            }}
            disabled={props.window.isFullScreen}
            bounds={{
                top: topBound,
                left: leftBound,
                right: rightBound,
                bottom: bottomBound,
            }}
        >
            <div
                className={classNames(style.appWindow, "appWindow", {
                    [style.collapsed]: props.window.isCollapsed,
                })}
                style={{
                    zIndex: props.window.depthIndex,
                    width: !props.window.isFullScreen
                        ? props.window.width
                        : "100%",
                    height: !props.window.isFullScreen
                        ? props.window.height
                        : "100%",
                }}
            >
                <Resizable
                    width={props.window.width}
                    height={props.window.height}
                    onResize={handleResize}
                    onResizeStart={handleResizeStart}
                    onResizeStop={handleResizeEnd}
                    axis={props.window.isFullScreen ? "none" : "both"}
                    resizeHandles={resizeDirections as ResizeHandle[]}
                    minConstraints={[MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT]}
                >
                    <div
                        className={classNames(style.windowContainer)}
                        onMouseDown={handleFocus}
                    >
                        <AppWindowHeader
                            icon={props.process.app.icon}
                            title={props.process.name}
                            isFocused={props.isFocused}
                            onClose={props.onClose}
                            onDoubleClick={handleHeaderDoubleClick}
                            hasBackward={false}
                            hasReload={true}
                            onBackward={() => true}
                            onReload={() => handleReload()}
                            onCollapse={() => handleCollapse()}
                            onFullscreen={() => handleFullScreen()}
                        />
                        <AppLoader
                            icon={props.process.app.icon}
                            disabled={isAppReady}
                        />
                        <AppWindowContent
                            process={props.process}
                            window={props.window}
                            url={props.url}
                            onReady={() => handleAppReady()}
                        />
                        <AppWindowUnfocusedOverlay
                            visible={
                                store.windowManager.hasDraggedWindow ||
                                store.windowManager.hasResizedWindow ||
                                !props.isFocused
                            }
                        />
                    </div>
                </Resizable>
            </div>
        </Draggable>
    );
};
