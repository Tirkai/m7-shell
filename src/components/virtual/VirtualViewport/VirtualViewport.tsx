import classNames from "classnames";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import React from "react";
import style from "./style.module.css";

interface IVirtualViewportProps {
    children: React.ReactNode;
    displayed: boolean;
}

const className = style.virtualViewport;

export const VirtualViewport = observer((props: IVirtualViewportProps) => {
    const store = useStore();

    const viewportOffset = store.virtualViewport.getIndexByViewport(
        store.virtualViewport.currentViewport,
    );

    return (
        <div
            className={classNames(className, {
                [style.displayed]: props.displayed,
            })}
            style={{
                transform: `translate(-${viewportOffset * 100}vw, 0)`,
            }}
        >
            <div
                className={style.container}
                style={{
                    gridTemplateColumns: `repeat(${store.virtualViewport.viewports.length}, 100vw)`,
                }}
            >
                {props.children}
            </div>
        </div>
    );
});
