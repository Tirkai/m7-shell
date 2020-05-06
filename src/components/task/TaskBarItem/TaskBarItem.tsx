import classNames from "classnames";
import React, { Component } from "react";
import style from "./style.module.css";

interface ITaskBarItemProps {
    executed?: boolean;
}

export class TaskBarItem extends Component<ITaskBarItemProps> {
    render() {
        return (
            <div
                className={classNames(style.taskBarItem, {
                    [style.executed]: this.props.executed,
                })}
            >
                {this.props.children}
            </div>
        );
    }
}
