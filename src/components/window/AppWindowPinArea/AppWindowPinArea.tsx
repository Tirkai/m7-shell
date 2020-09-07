import { IStore } from "interfaces/common/IStore";
import { IPinArea } from "interfaces/window/IPinArea";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import style from "./style.module.css";

interface IAppWindowPinAreaProps extends IStore {
    pinArea: IPinArea;
    windowArea: IPinArea;
    // areaWidth: number;
    // areaHeight: number;
    // windowWidth: number;
    // windowHeight: number;
    // top: number;
    // left: number;
}

@inject("store")
@observer
export class AppWindowPinArea extends Component<IAppWindowPinAreaProps> {
    state = {
        hovered: false,
    };

    @computed
    get store() {
        return this.props.store!;
    }

    handleMouseOver = () => {
        this.setState({
            hovered: true,
        });

        const draggedWindow = this.store.windowManager.draggedWindow;
        if (draggedWindow) {
            draggedWindow.setPinArea(this.props.windowArea);
        }
    };

    handleMouseOut = () => {
        this.setState({
            hovered: false,
        });
        const draggedWindow = this.store.windowManager.draggedWindow;
        if (draggedWindow) {
            draggedWindow.setPinArea(null);
        }
    };

    render() {
        return this.store.windowManager.draggedWindow ? (
            <div
                className={style.appWindowPinArea}
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
                style={{
                    ...this.props.pinArea,
                }}
            >
                <div
                    className={style.visibleArea}
                    style={
                        !this.state.hovered
                            ? { ...this.props.pinArea }
                            : { ...this.props.windowArea }
                    }
                ></div>
            </div>
        ) : (
            ""
        );
    }
}
