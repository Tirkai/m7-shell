import React from "react";
import style from "./style.module.css";

interface IVirtualFrameListProps {
    children: React.ReactNode;
    count: number;
}

const className = style.virtualFrameList;

export const VirtualFrameList = (props: IVirtualFrameListProps) => (
    <div className={className}>
        <div
            className={style.container}
            style={{ gridTemplateColumns: `repeat(${props.count + 1}, 250px)` }}
        >
            {props.children}
        </div>
    </div>
);
