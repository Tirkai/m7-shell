import { MarkerType, useMarker } from "@algont/m7-react-marker";
import classNames from "classnames";
import { ConfigCondition } from "components/config/ConfigCondition/ConfigCondition";
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH } from "constants/config";
import { useStore } from "hooks/useStore";
import { ApplicationProcess } from "models/process/ApplicationProcess";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import React, { useState } from "react";
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

    const { createMemoizedMarker } = useMarker();

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

    const resizeDirections = ["sw", "se", "nw", "ne", "w", "e", "n", "s"];

    const boundsVisibilityPercentModifier = 0.25;
    const boundsInvisibilityPercentModifier = 0.75;

    const topBound = 0;
    const leftBound = -props.width * boundsInvisibilityPercentModifier;
    const rightBound =
        window.innerWidth - props.width * boundsVisibilityPercentModifier;
    const bottomBound =
        window.innerHeight - props.height * boundsVisibilityPercentModifier;

    const { config } = store.config;

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
                {...createMemoizedMarker(MarkerType.Element, "AppWindow")}
                {...createMemoizedMarker(MarkerType.Id, props.process.app.id)}
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
                        <ConfigCondition
                            condition={
                                config["windows.singleWindow.header.enabled"]
                            }
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
                        </ConfigCondition>

                        <AppLoader
                            icon={props.process.app.icon}
                            disabled={isAppReady}
                        />
                        <div className={style.content}>
                            <AppWindowContent
                                process={props.process}
                                window={props.window}
                                url={props.url}
                                onReady={() => handleAppReady()}
                            />
                        </div>
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
