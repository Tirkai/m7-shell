import classNames from "classnames";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { ContextMenuItemModel } from "models/ContextMenuItemModel";
import React, { useEffect, useRef, useState } from "react";
import { ShellContextMenuItem } from "../ShellContextMenuItem/ShellContextMenuItem";
import style from "./style.module.css";
const className = style.contextMenu;

export const ShellContextMenu: React.FC = observer(() => {
    const store = useStore();
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const handleClick = (item: ContextMenuItemModel) => {
        store.contextMenu.hideContextMenu();

        item.onClick();
    };

    const ref = useRef<HTMLDivElement | null>(null);

    const onShowContextMenu = () => {
        if (ref.current && store.contextMenu.isShow) {
            const bounds = ref.current.getBoundingClientRect();

            const currentX = store.contextMenu.point.x;
            const currentY = store.contextMenu.point.y;

            if (currentX + bounds.width > window.innerWidth) {
                setX(window.innerWidth - bounds.width);
            } else setX(currentX);

            if (currentY + bounds.height > window.innerHeight) {
                setY(window.innerHeight - bounds.height);
            } else setY(currentY);
        }
    };

    useEffect(onShowContextMenu, [store.contextMenu.isShow]);

    return (
        <div
            className={classNames(className, {
                [style.show]: store.contextMenu.isShow,
            })}
            style={{
                top: y + "px",
                left: x + "px",
            }}
            id="context-menu"
            ref={ref}
        >
            <div className={classNames(style.container)}>
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
