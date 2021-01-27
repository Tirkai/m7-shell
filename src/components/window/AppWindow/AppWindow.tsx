import { AppMessageType } from "@algont/m7-shell-emitter";
import classNames from "classnames";
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH } from "constants/config";
import { useStore } from "hooks/useStore";
import { IStore } from "interfaces/common/IStore";
import { ApplicationProcess } from "models/ApplicationProcess";
import { ApplicationWindow } from "models/ApplicationWindow";
import { ExternalApplication } from "models/ExternalApplication";
import { ShellApplication } from "models/ShellApplication";
import React, { useEffect, useMemo, useState } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";
import {
    ResizableBox,
    ResizeCallbackData,
    ResizeHandle,
} from "react-resizable";
import AppLoader from "../AppLoader/AppLoader";
import { AppWindowHeader } from "../AppWindowHeader/AppWindowHeader";
import { AppWindowUnfocusedOverlay } from "../AppWindowUnfocusedOverlay/AppWindowUnfocusedOverlay";
import style from "./style.module.css";

interface IAppWindowProps extends IStore {
    process: ApplicationProcess;
    window: ApplicationWindow;
    width: number;
    height: number;
    isResizing: boolean;
    isDragging: boolean;
    isFocused: boolean;
    url: string;
    x: number;
    y: number;
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

    const handleFrameLoaded = (frameRef: HTMLIFrameElement) => {
        const context = frameRef?.contentWindow;
        if (context) {
            setFrame(frameRef);

            if (!isAppReady) {
                handleBindingEmitterEvents(props.process);
            }

            props.process.setEmitterContext(context);
            handleAppReady();
        }
    };

    const handleBindingEmitterEvents = (appProcess: ApplicationProcess) => {
        appProcess.emitter.on(AppMessageType.Connected, () => {
            handleAppReady();

            store.auth.injectAuthTokenInProcess(appProcess);
        });

        appProcess.emitter.on(AppMessageType.ForceRecieveToken, () =>
            store.auth.injectAuthTokenInProcess(appProcess),
        );

        // appProcess.emitter.on(AppMessageType.EnableBackwardButton, (payload) =>
        //     handleShowBackward(payload),
        // );
        // appProcess.emitter.on(AppMessageType.EnableReloadButton, (payload) =>
        //     handleShowReload(payload),
        // );
    };

    const handleAppReady = () => {
        setAppReady(true);
    };

    const handleResize = (
        event: React.SyntheticEvent,
        data: ResizeCallbackData,
    ) => {
        props.onResize((event as unknown) as MouseEvent, data);
    };

    const handleFocus = () => {
        store.windowManager.focusWindow(props.window);
    };

    // const handleShowBackward = (value: boolean) => {
    //     setState({ hasBackward: value });
    // };

    // const handleShowReload = (value: boolean) => {
    //     this.setState({ hasReload: value });
    // };

    const handleFullScreen = () => {
        props.window.setFullScreen(!props.window.isFullScreen);
    };

    const handleCollapse = () => {
        props.window.setCollapsed(true);
    };

    const handleHeaderDoubleClick = () => {
        const appWindow = props.window;
        appWindow.setFullScreen(!appWindow.isFullScreen);
    };

    const handleReload = () => {
        const iFrame = (frame as unknown) as HTMLIFrameElement;
        if (iFrame) {
            iFrame.setAttribute("src", iFrame.getAttribute("src") ?? "");
        }
    };

    useEffect(() => {
        setUrl(props.process.modifiedUrl);
    }, [props.process.modifiedUrl]);

    const appComponent = useMemo(() => {
        if (props.process.app instanceof ExternalApplication) {
            return (
                <iframe
                    onLoad={handleAppReady}
                    src={props.url}
                    ref={handleFrameLoaded}
                    title={props.process.name}
                    style={{
                        width: "100%",
                        height: "100%",
                        pointerEvents:
                            props.isResizing || props.isDragging
                                ? "none"
                                : "all",
                    }}
                    frameBorder={0}
                ></iframe>
            );
        }
        if (props.process.app instanceof ShellApplication) {
            return props.process.app.Component;
        }
        return <div>Sorry Link</div>;
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
                className={classNames(style.appWindow, {
                    [style.collapsed]: props.window.isCollapsed,
                })}
                style={{ zIndex: props.window.depthIndex }}
            >
                <ResizableBox
                    width={props.window.bounds.width}
                    height={props.window.bounds.height}
                    onResizeStart={handleResizeStart}
                    onResizeStop={handleResizeEnd}
                    onResize={handleResize}
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
                            onReload={handleReload}
                            onCollapse={() => handleCollapse()}
                            onFullscreen={() => handleFullScreen()}
                            visible={
                                store.shell.displayMode.showAppWindowHeader
                            }
                        />
                        <AppLoader
                            icon={props.process.app.icon}
                            disabled={isAppReady}
                        />
                        <div
                            className={classNames(style.content, {
                                [style.withHeader]:
                                    store.shell.displayMode.showAppWindowHeader,
                            })}
                        >
                            {appComponent}
                        </div>
                        <AppWindowUnfocusedOverlay
                            visible={
                                store.windowManager.hasDraggedWindow ||
                                store.windowManager.hasResizedWindow ||
                                !props.isFocused
                            }
                        />
                    </div>
                </ResizableBox>
            </div>
        </Draggable>
    );
};
