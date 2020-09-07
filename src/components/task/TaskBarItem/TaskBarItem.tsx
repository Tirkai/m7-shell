import classNames from "classnames";
import { DropdownMenu } from "components/controls/DropdownMenu/DropdownMenu";
import React, { Component } from "react";
import style from "./style.module.css";

interface ITaskBarItemProps {
    onClick: () => void;
    autoWidth?: boolean;
    executed?: boolean;
    focused?: boolean;
    badge?: string | number;
    menu?: JSX.Element[];
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
                        {!isBigNumber ? this.props.badge : "99+"}
                    </div>
                ) : (
                    ""
                )}
                <DropdownMenu
                    trigger="context"
                    position="topEdge"
                    render={this.props.menu ?? []}
                >
                    <div className={style.content}>{this.props.children}</div>
                </DropdownMenu>
            </div>
        );
    }
}
