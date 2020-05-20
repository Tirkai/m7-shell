import React, { Component } from "react";
import style from "./style.module.css";

interface IAppWindowUnfocusedOverlayProps {
    visible: boolean;
}

export class AppWindowUnfocusedOverlay extends Component<
    IAppWindowUnfocusedOverlayProps
> {
    render() {
        return this.props.visible ? <div className={style.overlay} /> : "";
    }
}
