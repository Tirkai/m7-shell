import classNames from "classnames";
import { PerformanceContext } from "contexts/PerformanceContext";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { ContextMenuItemModel } from "models/ContextMenuItemModel";
import React, { useContext } from "react";
import { ShellContextMenuItem } from "../ShellContextMenuItem/ShellContextMenuItem";
import style from "./style.module.css";
const className = style.contextMenu;

export const ShellContextMenu: React.FC = observer(() => {
    const store = useStore();
    const performanceMode = useContext(PerformanceContext);
    const handleClick = (item: ContextMenuItemModel) => {
        store.contextMenu.hideContextMenu();

        item.onClick();
    };

    return (
        <div
            className={classNames(className, {
                [style.show]: store.contextMenu.isShow,
            })}
            style={{
                top: store.contextMenu.point.y + "px",
                left: store.contextMenu.point.x + "px",
            }}
            id="context-menu"
        >
            <div
                className={classNames(style.container, {
                    "no-animate": !performanceMode.mode.enableAnimation,
                })}
            >
                {store.contextMenu.items.map((item) => (
                    <ShellContextMenuItem
                        key={item.id}
                        icon={item.icon}
                        content={item.content}
                        onClick={() => handleClick(item)}
                    />
                ))}
            </div>
        </div>
    );
});
