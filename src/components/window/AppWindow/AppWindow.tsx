import { BrokerMessageType } from "@algont/m7-shell-broker";
import classNames from "classnames";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { Application } from "models/Application";
import { ApplicationWindow } from "models/ApplicationWindow";
import { ExternalApllication } from "models/ExternalApplication";
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

@inject("store")
@observer
export class AppWindow extends Component<IAppWindowProps> {
    state = {
        isAppReady: false,
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
            if (app instanceof ExternalApllication && context) {
                app.setBrokerContext(context);

                app.broker.subscribe(BrokerMessageType.Connected, () => {
                    this.store.auth.injectAuthTokenInExternalApplication(app);
                });
            }
            this.handleAppReady();
        }
    };

    handleAppReady = () => {
        this.setState({ isAppReady: true });
    };

    handleResize = (event: React.SyntheticEvent, data: ResizeCallbackData) => {
        this.props.onResize((event as unknown) as MouseEvent, data);
    };

    handleFocus = () => {
        this.store.windowManager.focusWindow(this.props.window);
        console.log(this.props.window.depthIndex);
    };

    componentDidMount() {
        if (this.props.application instanceof ShellApplication) {
            this.setState({ isAppReady: true });
        }
    }

    appComponent: JSX.Element | null = null;
    render() {
        if (this.props.application instanceof ExternalApllication) {
            this.appComponent = (
                <iframe
                    onLoad={this.handleAppReady}
                    src={this.props.application.url}
                    ref={this.handleFrameLoaded}
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

        return (
            <Draggable
                handle=".appHeaderInfoBar"
                onStart={this.props.onDragStart}
                onStop={this.props.onDragStop}
                onDrag={this.props.onDrag}
                position={{
                    x: this.props.x,
                    y: this.props.y,
                }}
            >
                <div
                    className={style.appWindow}
                    style={{ zIndex: this.props.window.depthIndex }}
                >
                    <ResizableBox
                        width={this.props.width}
                        height={this.props.height}
                        onResizeStart={this.handleResizeStart}
                        onResizeStop={this.handleResizeEnd}
                        onResize={this.handleResize}
                        resizeHandles={resizeDirections as ResizeHandle[]}
                        minConstraints={[300, 200]}
                    >
                        <div
                            className={style.windowContainer}
                            onMouseDown={this.handleFocus}
                        >
                            <AppWindowHeader
                                icon={this.props.application.icon}
                                title={this.props.application.name}
                                onClose={this.props.onClose}
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
