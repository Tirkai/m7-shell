import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

interface IVirtualFrameProps {
    children: React.ReactNode;
    active?: boolean;
}

const className = style.virtualFrame;

export const VirtualFrame = (props: IVirtualFrameProps) => (
    <div className={classNames(className, { [style.active]: props.active })}>
        {props.children}
    </div>
);
