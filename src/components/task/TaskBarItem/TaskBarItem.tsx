import classNames from "classnames";
import { useStore } from "hooks/useStore";
import { IStore } from "interfaces/common/IStore";
import { observer } from "mobx-react";
import { ContextMenuItemModel } from "models/ContextMenuItemModel";
import { Point2D } from "models/Point2D";
import React, { useState } from "react";
import style from "./style.module.css";

interface ITaskBarItemProps extends IStore {
    onClick?: () => void;
    autoWidth?: boolean;
    executed?: boolean;
    focused?: boolean;
    badge?: string | number;
    menu?: ContextMenuItemModel[];
    hint?: React.ReactNode;
    children?: React.ReactNode;
}

export const TaskBarItem = observer((props: ITaskBarItemProps) => {
    const store = useStore();
    const [isShowHint, setShowHint] = useState(false);
    const handleShowContextMenu = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        if (props.menu?.length) {
            store.contextMenu.showContextMenu(
                new Point2D(e.pageX, e.pageY),
                props.menu,
            );
        }
    };

    const handleMouseOver = () => {
        setShowHint(true);
    };

    const handleMouseOut = () => {
        setShowHint(false);
    };

    const isBigNumber = +(props.badge ?? 0) >= 100;

    return (
        <div
            className={classNames(style.taskBarItem, {
                [style.executed]: props.executed,
                [style.autoWidth]: props.autoWidth,
                [style.focused]: props.focused,
            })}
            onClick={props.onClick}
        >
            {props.hint && isShowHint && props.hint}
            {props.badge ? (
                <div
                    className={classNames(style.badge, {
                        [style.smallBadge]: isBigNumber,
                    })}
                >
                    {!isBigNumber ? props.badge : "99+"}
                </div>
            ) : (
                ""
            )}
            <div
                onContextMenu={handleShowContextMenu}
                className={style.content}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseOut}
            >
                {props.children}
            </div>
        </div>
    );
});
