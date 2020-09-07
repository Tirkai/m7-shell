import { TASKBAR_HEIGHT } from "constants/config";
import { IPinArea } from "interfaces/window/IPinArea";
import React, { Component } from "react";
import { AppWindowPinArea } from "../AppWindowPinArea/AppWindowPinArea";

interface IPinAreaComponentProps {
    key: string;
    pinArea: IPinArea;
    windowArea: IPinArea;
}

const CORNER_SIZE = 50;
const EDGE_SIZE = 10;

export class AppWindowPinContainer extends Component {
    render() {
        const pins: IPinAreaComponentProps[] = [
            {
                key: "top",
                pinArea: {
                    top: 0,
                    left: CORNER_SIZE,
                    width: window.innerWidth - CORNER_SIZE * 2,
                    height: 5,
                },
                windowArea: {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight - TASKBAR_HEIGHT,
                    isFullscreen: true,
                },
            },

            {
                key: "right",
                pinArea: {
                    top: CORNER_SIZE,
                    left: window.innerWidth - EDGE_SIZE,
                    width: EDGE_SIZE,
                    height:
                        window.innerHeight - TASKBAR_HEIGHT - CORNER_SIZE * 2,
                },
                windowArea: {
                    top: 0,
                    left: window.innerWidth / 2,
                    width: window.innerWidth / 2,
                    height: window.innerHeight - TASKBAR_HEIGHT,
                },
            },
            {
                key: "left",
                pinArea: {
                    top: CORNER_SIZE,
                    left: 0,
                    width: EDGE_SIZE,
                    height: window.innerHeight - TASKBAR_HEIGHT - CORNER_SIZE,
                },
                windowArea: {
                    top: 0,
                    left: 0,
                    width: window.innerWidth / 2,
                    height: window.innerHeight - TASKBAR_HEIGHT,
                },
            },

            {
                key: "topLeft",
                pinArea: {
                    top: 0,
                    left: 0,
                    width: CORNER_SIZE,
                    height: CORNER_SIZE,
                },
                windowArea: {
                    top: 0,
                    left: 0,
                    width: window.innerWidth / 2,
                    height: window.innerHeight / 2 - TASKBAR_HEIGHT,
                },
            },
            {
                key: "topRight",
                pinArea: {
                    top: 0,
                    left: window.innerWidth - CORNER_SIZE,
                    width: CORNER_SIZE,
                    height: CORNER_SIZE,
                },
                windowArea: {
                    top: 0,
                    left: window.innerWidth / 2,
                    width: window.innerWidth / 2,
                    height: window.innerHeight / 2 - TASKBAR_HEIGHT,
                },
            },
            {
                key: "bottomRight",
                pinArea: {
                    top: window.innerHeight - TASKBAR_HEIGHT - CORNER_SIZE,
                    left: window.innerWidth - CORNER_SIZE,
                    width: CORNER_SIZE,
                    height: CORNER_SIZE,
                },
                windowArea: {
                    top: window.innerHeight / 2 - TASKBAR_HEIGHT,
                    left: window.innerWidth / 2,
                    width: window.innerWidth / 2,
                    height: window.innerHeight / 2,
                },
            },

            {
                key: "bottomLeft",
                pinArea: {
                    top: window.innerHeight - TASKBAR_HEIGHT - CORNER_SIZE,
                    left: 0,
                    width: CORNER_SIZE,
                    height: CORNER_SIZE,
                },
                windowArea: {
                    top: window.innerHeight / 2 - TASKBAR_HEIGHT,
                    left: 0,
                    width: window.innerWidth / 2,
                    height: window.innerHeight / 2,
                },
            },
        ];

        return (
            <>
                {pins.map((item) => (
                    <AppWindowPinArea {...item} />
                ))}
            </>
        );
    }
}
