import classNames from "classnames";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { ContextMenuItemModel } from "models/ContextMenuItemModel";
import { Point2D } from "models/Point2D";
import React, { Component } from "react";
import style from "./style.module.css";

interface ITaskBarItemProps extends IStore {
    onClick: () => void;
    autoWidth?: boolean;
    executed?: boolean;
    focused?: boolean;
    badge?: string | number;
    menu?: ContextMenuItemModel[];
}

@inject("store")
@observer
export class TaskBarItem extends Component<ITaskBarItemProps> {
    @computed
    get store() {
        return this.props.store!;
    }

    handleShowContextMenu = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        if (this.props.menu?.length) {
            this.store.contextMenu.showContextMenu(
                new Point2D(e.pageX, e.pageY),
                this.props.menu,
            );
        }
    };

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
                <div
                    onContextMenu={this.handleShowContextMenu}
                    className={style.content}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }
}
