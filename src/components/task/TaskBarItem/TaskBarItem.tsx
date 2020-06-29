import classNames from "classnames";
import React, { Component } from "react";
import style from "./style.module.css";

interface ITaskBarItemProps {
    onClick: () => void;
    autoWidth?: boolean;
    executed?: boolean;
    focused?: boolean;
    badge?: string;
}

export class TaskBarItem extends Component<ITaskBarItemProps> {
    render() {
        return (
            <div
                className={classNames(style.taskBarItem, {
                    [style.executed]: this.props.executed,
                    [style.autoWidth]: this.props.autoWidth,
                    [style.focused]: this.props.focused,
                })}
                onClick={this.props.onClick}
            >
                {this.props.badge ? (
                    <div className={style.badge}>{this.props.badge}</div>
                ) : (
                    ""
                )}
                <div className={style.content}>{this.props.children}</div>
            </div>
        );
    }
}
