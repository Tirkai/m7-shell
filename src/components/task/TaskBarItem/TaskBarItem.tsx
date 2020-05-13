import classNames from "classnames";
import React, { Component } from "react";
import style from "./style.module.css";

interface ITaskBarItemProps {
    onClick: () => void;
    autoWidth?: boolean;
    executed?: boolean;
}

export class TaskBarItem extends Component<ITaskBarItemProps> {
    render() {
        return (
            <div
                className={classNames(style.taskBarItem, {
                    [style.executed]: this.props.executed,
                    [style.autoWidth]: this.props.autoWidth,
                })}
                onClick={this.props.onClick}
            >
                {this.props.children}
            </div>
        );
    }
}
