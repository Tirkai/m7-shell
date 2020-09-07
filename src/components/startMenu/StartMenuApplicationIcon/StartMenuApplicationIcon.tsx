import classNames from "classnames";
import React, { Component } from "react";
import style from "./style.module.css";

export class StartMenuApplicationIcon extends Component {
    render() {
        return (
            <div className={classNames(style.startMenuApplicationIcon)}>
                {this.props.children}
            </div>
        );
    }
}
