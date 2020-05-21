import React, { Component } from "react";
import style from "./style.module.css";

interface IAppWindowHeaderActionProps {
    icon: string;
    onClick: () => void;
}

export class AppWindowHeaderAction extends Component<
    IAppWindowHeaderActionProps
> {
    render() {
        return (
            <div className={style.action} onClick={this.props.onClick}>
                <img src={this.props.icon} />
            </div>
        );
    }
}
