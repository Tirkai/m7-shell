import classNames from "classnames";
import React, { Component } from "react";
import style from "./style.module.css";

const className = style.appsMenuSidebarListItem;

export class AppsMenuSidebarListItem extends Component {
    render() {
        return (
            <div className={classNames(className)}>{this.props.children}</div>
        );
    }
}
