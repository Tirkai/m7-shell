import { Application } from "models/Application";
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
import style from "./style.module.css";

interface IAppWindowProps {
    application: Application;
    width: number;
    height: number;
    isResizing: boolean;
    isDragging: boolean;
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

export class AppWindow extends Component<IAppWindowProps> {
    state = {
        isAppReady: false,
    };

    handleResizeStart = (
        event: React.SyntheticEvent,
        data: ResizeCallbackData,
    ) => {
        this.props.onResizeStart((event as unknown) as MouseEvent, data);
    };

    handleResizeEnd = () => {
        this.props.onResizeStop();
    };

    handleAppReady = () => {
        this.setState({ isAppReady: true });
    };

    handleResize = (event: React.SyntheticEvent, data: ResizeCallbackData) => {
        this.props.onResize((event as unknown) as MouseEvent, data);
    };

    componentDidMount() {
        if (this.props.application instanceof ShellApplication) {
            this.setState({ isAppReady: true });
        }
    }

    render() {
        let appComponent;

        if (this.props.application instanceof ExternalApllication) {
            appComponent = (
                <iframe
                    onLoad={this.handleAppReady}
                    src={this.props.application.url}
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
            appComponent = this.props.application.Component;
        }

        const resizeDirections = ["sw", "se", "nw", "ne", "w", "e", "n", "s"];

        return (
            <Draggable
                handle=".appWindowHeader"
                onStart={this.props.onDragStart}
                onStop={this.props.onDragStop}
                onDrag={this.props.onDrag}
                position={{
                    x: this.props.x,
                    y: this.props.y,
                }}
            >
                <div className={style.appWindow}>
                    <ResizableBox
                        width={this.props.width}
                        height={this.props.height}
                        onResizeStart={this.handleResizeStart}
                        onResizeStop={this.handleResizeEnd}
                        onResize={this.handleResize}
                        resizeHandles={resizeDirections as ResizeHandle[]}
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
                        <div className={style.container}>{appComponent}</div>
                    </ResizableBox>
                </div>
            </Draggable>
        );
    }
}
