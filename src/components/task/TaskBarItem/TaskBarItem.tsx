import classNames from "classnames";
import React, { Component } from "react";
import style from "./style.module.css";

interface ITaskBarItemProps {
    onClick: () => void;
    autoWidth?: boolean;
    executed?: boolean;
    focused?: boolean;
    badge?: string | number;
}

export class TaskBarItem extends Component<ITaskBarItemProps> {
    render() {
        const isBigNumber = +(this.props.badge ?? 0) >= 100;

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
                    <div
                        className={classNames(style.badge, {
                            [style.smallBadge]: isBigNumber,
                        })}
                    >
                        {this.props.badge}
                    </div>
                ) : (
                    ""
                )}
                <div className={style.content}>{this.props.children}</div>
            </div>
        );
    }
}
