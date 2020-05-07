import React, { Component } from "react";
import style from "./style.module.css";
interface IAppsMenuItemProps {
    onClick: () => void;
}

export class AppsMenuItem extends Component<IAppsMenuItemProps> {
    render() {
        return (
            <div className={style.appsMenuItem} onClick={this.props.onClick}>
                {this.props.children}
            </div>
        );
    }
}
