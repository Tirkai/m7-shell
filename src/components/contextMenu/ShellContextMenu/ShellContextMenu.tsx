import classNames from "classnames";
import { Point2D } from "models/shape/Point2D";
import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.css";
const className = style.contextMenu;

interface IContextMenuOptions {
    position: Point2D;
    isShow: boolean;
    children: React.ReactNode;
}

export const ShellContextMenu = (props: IContextMenuOptions) => {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const ref = useRef<HTMLDivElement | null>(null);

    const onShowContextMenu = () => {
        if (ref.current) {
            const bounds = ref.current.getBoundingClientRect();

            const currentX = props.position.x;
            const currentY = props.position.y;

            if (currentX + bounds.width > window.innerWidth) {
                setX(window.innerWidth - bounds.width);
            } else setX(currentX);

            if (currentY + bounds.height > window.innerHeight) {
                setY(window.innerHeight - bounds.height);
            } else setY(currentY);
        }
    };

    useEffect(onShowContextMenu, [props.position]);

    return (
        <div
            className={classNames(className, {
                [style.show]: props.isShow,
            })}
            style={{
                top: y + "px",
                left: x + "px",
            }}
            id="context-menu"
            ref={ref}
        >
            <div className={classNames(style.container)}>{props.children}</div>
        </div>
    );
};
