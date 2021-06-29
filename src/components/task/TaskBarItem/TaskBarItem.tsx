import { MarkerType, useMarker } from "@algont/m7-react-marker";
import classNames from "classnames";
import { Hint } from "components/hint/Hint/Hint";
import { useStore } from "hooks/useStore";
import { IStore } from "interfaces/common/IStore";
import { observer } from "mobx-react";
import { ContextMenuItemModel } from "models/ContextMenuItemModel";
import { Point2D } from "models/Point2D";
import React, { useRef, useState } from "react";
import style from "./style.module.css";

interface ITaskBarItemProps extends IStore {
    onClick?: (event: React.MouseEvent) => void;
    autoWidth?: boolean;
    executed?: boolean;
    focused?: boolean;
    name?: string;
    badge?: string | number;
    menu?: ContextMenuItemModel[];
    hint?: React.ReactNode;
    children?: React.ReactNode;
    displayHint?: boolean;
}

export const TaskBarItem = observer((props: ITaskBarItemProps) => {
    const store = useStore();
    const [isShowHint, setShowHint] = useState(false);
    const [position, setPosition] = useState(new Point2D(0, 0));
    const ref = useRef<HTMLDivElement | null>(null);

    const { createMemoizedMarker } = useMarker();

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
        if (ref.current) {
            const bounds = ref.current.getBoundingClientRect();

            setPosition(new Point2D(bounds.x + bounds.width / 2, bounds.y + 5));
        }

        setShowHint(true);
    };

    const handleMouseOut = () => {
        setShowHint(false);
    };

    const isBigNumber = +(props.badge ?? 0) >= 100;

    return (
        <>
            {props.displayHint && isShowHint && (
                <Hint title={props.name} position={position} />
            )}
            <div
                className={classNames(style.taskBarItem, {
                    [style.executed]: props.executed,
                    [style.autoWidth]: props.autoWidth,
                    [style.focused]: props.focused,
                })}
                {...createMemoizedMarker(MarkerType.Element, "TaskBarItem")}
                onClick={props.onClick}
                ref={ref}
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
        </>
    );
});
