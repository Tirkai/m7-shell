import React, { Component } from "react";
import style from "./style.module.css";
interface IAppsMenuItemProps {
    icon: string;
    title: string;
    onClick: () => void;
}

export class AppsMenuItem extends Component<IAppsMenuItemProps> {
    render() {
        return (
            <div className={style.appsMenuItem} onClick={this.props.onClick}>
                <div className={style.icon}>
                    <img src={this.props.icon} />
                </div>
                <div className={style.title}>{this.props.title}</div>
            </div>
        );
    }
}
