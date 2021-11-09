import classNames from "classnames";
import React, { Component } from "react";
import style from "./style.module.css";

export class AppsMenuApplicationIcon extends Component {
    render() {
        return (
            <div className={classNames(style.appsMenuApplicationIcon)}>
                {this.props.children}
            </div>
        );
    }
}
