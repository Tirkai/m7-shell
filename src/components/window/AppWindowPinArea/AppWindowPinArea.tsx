import { IStore } from "interfaces/common/IStore";
import { IPinArea } from "interfaces/window/IPinArea";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import style from "./style.module.css";

interface IAppWindowPinAreaProps extends IStore {
    pinArea: IPinArea;
    windowArea: IPinArea;
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
    };

    handleMouseOut = () => {
        this.setState({
            hovered: false,
        });
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
