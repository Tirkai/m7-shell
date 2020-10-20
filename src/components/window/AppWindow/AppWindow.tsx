import { AppMessageType } from "@algont/m7-shell-emitter";
import classNames from "classnames";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { Application } from "models/Application";
import { ApplicationWindow } from "models/ApplicationWindow";
import { ExternalApplication } from "models/ExternalApplication";
import { ShellApplication } from "models/ShellApplication";
import React, { Component } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";
import {
    ResizableBox,
    ResizeCallbackData,
    ResizeHandle,
} from "react-resizable";
import AppLoader from "../AppLoader/AppLoader";
import AppWindowHeader from "../AppWindowHeader/AppWindowHeader";
import { AppWindowUnfocusedOverlay } from "../AppWindowUnfocusedOverlay/AppWindowUnfocusedOverlay";
import style from "./style.module.css";

interface IAppWindowProps extends IStore {
    application: Application;
    window: ApplicationWindow;
    width: number;
    height: number;
    isResizing: boolean;
    isDragging: boolean;
    isFocused: boolean;
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

interface IAppWindowState {
    isAppReady: boolean;
    hasBackward: boolean;
    hasReload: boolean;
    customUrl: string;
}

@inject("store")
@observer
export class AppWindow extends Component<IAppWindowProps, IAppWindowState> {
    state = {
        isAppReady: false,
        hasBackward: false,
        hasReload: false,
        customUrl: "",
    };

    @computed
    get store() {
        return this.props.store!;
    }

    handleResizeStart = (
        event: React.SyntheticEvent,
        data: ResizeCallbackData,
    ) => {
        this.props.onResizeStart((event as unknown) as MouseEvent, data);
    };

    handleResizeEnd = () => {
        this.props.onResizeStop();
    };

    handleFrameLoaded = (frameRef: HTMLIFrameElement) => {
        const context = frameRef?.contentWindow;
        if (context) {
            const app = this.props.application;
            if (app instanceof ExternalApplication) {
                app.setEmitterContext(context);
                this.handleBindingEmitterEvents(app);
            }
            this.handleAppReady();
        }
    };

    handleBindingEmitterEvents = (app: ExternalApplication) => {
        app.emitter.on(AppMessageType.Connected, () => {
            this.store.auth.injectAuthTokenInExternalApplication(app);
        });

        app.emitter.on(AppMessageType.ForceRecieveToken, () =>
            this.store.auth.injectAuthTokenInExternalApplication(app),
        );

        app.emitter.on(AppMessageType.EnableBackwardButton, (payload) =>
            this.handleShowBackward(payload),
        );
        app.emitter.on(AppMessageType.EnableReloadButton, (payload) =>
            this.handleShowReload(payload),
        );
    };

    handleAppReady = () => {
        this.setState({ isAppReady: true });
    };

    handleResize = (event: React.SyntheticEvent, data: ResizeCallbackData) => {
        this.props.onResize((event as unknown) as MouseEvent, data);
    };

    handleFocus = () => {
        this.store.windowManager.focusWindow(this.props.window);
    };

    handleShowBackward = (value: boolean) => {
        this.setState({ hasBackward: value });
    };

    handleShowReload = (value: boolean) => {
        this.setState({ hasReload: value });
    };

    handleFullScreen = () => {
        this.props.window.setFullScreen(!this.props.window.isFullScreen);
    };

    handleCollapse = () => {
        this.props.window.setCollapsed(true);
    };

    handleHeaderDoubleClick = () => {
        const appWindow = this.props.window;
        appWindow.setFullScreen(!appWindow.isFullScreen);
    };

    componentDidMount() {
        const app = this.props.application;
        if (app instanceof ShellApplication) {
            this.setState({ isAppReady: true });
        }
    }

    appComponent: JSX.Element | null = null;
    render() {
        if (this.props.application instanceof ExternalApplication) {
            this.appComponent = (
                <iframe
                    onLoad={this.handleAppReady}
                    src={this.props.application.applicationUrl}
                    ref={this.handleFrameLoaded}
                    title={this.props.application.name}
                    style={{
                        width: "100%",
                        height: "100%",
                        pointerEvents:
                            this.props.isResizing || this.props.isDragging
                                ? "none"
                                : "all",
                    }}
                    frameBorder={0}
                ></iframe>
            );
        }
        if (this.props.application instanceof ShellApplication) {
            this.appComponent = this.props.application.Component;
        }

        const resizeDirections = ["sw", "se", "nw", "ne", "w", "e", "n", "s"];

        const boundsVisibilityPercentModifier = 0.25;
        const boundsInvisibilityPercentModifier = 0.75;

        const topBound = 0;
        const leftBound = -this.props.width * boundsInvisibilityPercentModifier;
        const rightBound =
            window.innerWidth -
            this.props.width * boundsVisibilityPercentModifier;
        const bottomBound =
            window.innerHeight -
            this.props.height * boundsVisibilityPercentModifier;
        return (
            <Draggable
                handle=".appHeaderInfoBar"
                onStart={this.props.onDragStart}
                onStop={this.props.onDragStop}
                onDrag={this.props.onDrag}
                position={{
                    x: this.props.window.bounds.x,
                    y: this.props.window.bounds.y,
                }}
                disabled={this.props.window.isFullScreen}
                bounds={{
                    top: topBound,
                    left: leftBound,
                    right: rightBound,
                    bottom: bottomBound,
                }}
            >
                <div
                    className={classNames(style.appWindow, {
                        [style.collapsed]: this.props.window.isCollapsed,
                    })}
                    style={{ zIndex: this.props.window.depthIndex }}
                >
                    <ResizableBox
                        width={this.props.window.bounds.width}
                        height={this.props.window.bounds.height}
                        onResizeStart={this.handleResizeStart}
                        onResizeStop={this.handleResizeEnd}
                        onResize={this.handleResize}
                        axis={this.props.window.isFullScreen ? "none" : "both"}
                        resizeHandles={resizeDirections as ResizeHandle[]}
                        minConstraints={[
                            this.props.application.minWidth,
                            this.props.application.minHeight,
                        ]}
                    >
                        <div
                            className={classNames(style.windowContainer, {
                                [style.fullScreen]: this.props.window
                                    .isFullScreen,
                            })}
                            onMouseDown={this.handleFocus}
                        >
                            <AppWindowHeader
                                icon={this.props.application.icon}
                                title={this.props.application.name}
                                isFocused={this.props.isFocused}
                                onClose={this.props.onClose}
                                onDoubleClick={this.handleHeaderDoubleClick}
                                hasBackward={this.state.hasBackward}
                                hasReload={this.state.hasReload}
                                onBackward={() => true}
                                onReload={() => true}
                                onCollapse={() => this.handleCollapse()}
                                onFullscreen={() => this.handleFullScreen()}
                            />
                            <AppLoader
                                icon={this.props.application.icon}
                                disabled={this.state.isAppReady}
                            />
                            <div className={classNames(style.content)}>
                                {this.appComponent && this.appComponent}
                            </div>
                            <AppWindowUnfocusedOverlay
                                visible={!this.props.isFocused}
                            />
                        </div>
                    </ResizableBox>
                </div>
            </Draggable>
        );
    }
}
