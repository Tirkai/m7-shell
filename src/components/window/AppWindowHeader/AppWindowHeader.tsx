import { cross } from "assets/icons";
import classNames from "classnames";
import React, { Component } from "react";
import style from "./style.module.css";

interface IAppWindowHeaderProps {
    icon: string;
    title: string;
    onClose: () => void;
}

export class AppWindowHeader extends Component<IAppWindowHeaderProps> {
    render() {
        return (
            <div
                className={classNames("appWindowHeader", style.appWindowHeader)}
            >
                <div className={style.container}>
                    <div className={style.info}>
                        <div className={style.icon}>
                            <img src={this.props.icon} />
                        </div>
                        <div className={style.title}>{this.props.title}</div>
                    </div>
                    <div className={style.actions}>
                        <div
                            className={style.actionItem}
                            onClick={this.props.onClose}
                        >
                            <img src={cross} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AppWindowHeader;
