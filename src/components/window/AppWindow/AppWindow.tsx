import { Application } from "models/Application";
import { ExternalApllication } from "models/ExternalApplication";
import React, { Component } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import AppWindowHeader from "../AppWindowHeader/AppWindowHeader";
import style from "./style.module.css";

interface IAppWindowProps {
    application: Application;
    width: number;
    height: number;
    isResizing: boolean;
    isDragging: boolean;
    onResizeStart: () => void;
    onResizeStop: () => void;
    onDragStart: () => void;
    onDragStop: () => void;
}

export class AppWindow extends Component<IAppWindowProps> {
    state = {
        isResizing: false,
    };

    handleResizeStart = () => {
        this.props.onResizeStart();
    };

    handleResizeEnd = () => {
        this.props.onResizeStop();
        // this.setState({
        //     isResizing: false,
        // });
        // console.log("resize stop");
    };

    render() {
        let appComponent;

        if (this.props.application instanceof ExternalApllication) {
            appComponent = (
                <iframe
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

        return (
            <div
                className={style.appWindowHint}
                style={{ top: "100px", left: "100px" }}
            >
                <Draggable
                    handle=".appWindowHeader"
                    onStart={this.props.onDragStart}
                    onStop={this.props.onDragStop}
                >
                    <div className={style.appWindow}>
                        <ResizableBox
                            width={this.props.width}
                            height={this.props.height}
                            onResizeStart={this.handleResizeStart}
                            onResizeStop={this.handleResizeEnd}
                            resizeHandles={[
                                "sw",
                                "se",
                                "nw",
                                "ne",
                                "w",
                                "e",
                                "n",
                                "s",
                            ]}
                        >
                            <AppWindowHeader />
                            <div className={style.container}>
                                {appComponent}
                            </div>
                        </ResizableBox>
                    </div>
                </Draggable>
            </div>
        );
    }
}
