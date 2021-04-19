import { IStore } from "interfaces/common/IStore";
import { IPinArea } from "interfaces/window/IPinArea";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { AppWindowPinArea } from "../AppWindowPinArea/AppWindowPinArea";

interface IPinAreaComponentProps {
    key: string;
    pinArea: IPinArea;
    windowArea: IPinArea;
}

const CORNER_SIZE = 50;
const EDGE_SIZE = 10;

@inject("store")
@observer
export class AppWindowPinContainer extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

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
                    height: window.innerHeight,
                    isFullscreen: true,
                },
            },

            {
                key: "right",
                pinArea: {
                    top: CORNER_SIZE,
                    left: window.innerWidth - EDGE_SIZE,
                    width: EDGE_SIZE,
                    height: window.innerHeight - CORNER_SIZE * 2,
                },
                windowArea: {
                    top: 0,
                    left: window.innerWidth / 2,
                    width: window.innerWidth / 2,
                    height: window.innerHeight,
                },
            },
            {
                key: "left",
                pinArea: {
                    top: CORNER_SIZE,
                    left: 0,
                    width: EDGE_SIZE,
                    height: window.innerHeight - CORNER_SIZE,
                },
                windowArea: {
                    top: 0,
                    left: 0,
                    width: window.innerWidth / 2,
                    height: window.innerHeight,
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
                    height: window.innerHeight / 2,
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
                    height: window.innerHeight / 2,
                },
            },
            {
                key: "bottomRight",
                pinArea: {
                    top: window.innerHeight - CORNER_SIZE,
                    left: window.innerWidth - CORNER_SIZE,
                    width: CORNER_SIZE,
                    height: CORNER_SIZE,
                },
                windowArea: {
                    top: window.innerHeight / 2,
                    left: window.innerWidth / 2,
                    width: window.innerWidth / 2,
                    height: window.innerHeight / 2,
                },
            },

            {
                key: "bottomLeft",
                pinArea: {
                    top: window.innerHeight - CORNER_SIZE,
                    left: 0,
                    width: CORNER_SIZE,
                    height: CORNER_SIZE,
                },
                windowArea: {
                    top: window.innerHeight / 2,
                    left: 0,
                    width: window.innerWidth / 2,
                    height: window.innerHeight / 2,
                },
            },
        ];

        return pins.map((item) => <AppWindowPinArea {...item} />);
    }
}
