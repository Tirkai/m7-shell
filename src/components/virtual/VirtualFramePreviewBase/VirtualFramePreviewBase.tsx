import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

interface IVirtualFramePreviewBaseProps {
    children: React.ReactNode;
    onClick?: () => void;
    color?: "default" | "light";
}

const className = style.virtualFramePreviewBase;

export const VirtualFramePreviewBase = (
    props: IVirtualFramePreviewBaseProps,
) => (
    <div
        className={classNames(className, style[props.color ?? "default"])}
        onClick={props.onClick}
    >
        {props.children}
    </div>
);
