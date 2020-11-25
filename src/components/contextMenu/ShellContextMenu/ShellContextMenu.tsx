import classNames from "classnames";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { ContextMenuItemModel } from "models/ContextMenuItemModel";
import React, { Component } from "react";
import { ShellContextMenuItem } from "../ShellContextMenuItem/ShellContextMenuItem";
import style from "./style.module.css";
const className = style.contextMenu;
@inject("store")
@observer
export class ShellContextMenu extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    handleClick = (item: ContextMenuItemModel) => {
        this.store.contextMenu.hideContextmenu();

        item.onClick();
    };

    handleReady = () => {
        this.store.contextMenu.setReady(true);
    };

    render() {
        return (
            <div
                className={classNames(className, {
                    [style.show]: this.store.contextMenu.isShow,
                })}
                style={{
                    top: this.store.contextMenu.point.y + "px",
                    left: this.store.contextMenu.point.x + "px",
                }}
                id="context-menu"
                onAnimationEnd={() => this.handleReady()}
            >
                <div className={style.container}>
                    {this.store.contextMenu.items.map((item) => (
                        <ShellContextMenuItem
                            key={item.id}
                            icon={item.icon}
                            content={item.content}
                            onClick={() => this.handleClick(item)}
                        />
                    ))}
                </div>
            </div>
        );
    }
}
