import React from "react";
import style from "./style.module.css";

interface IVirtualFramePreviewBaseProps {
    children: React.ReactNode;
    onClick?: () => void;
}

const className = style.virtualFramePreviewBase;

export const VirtualFramePreviewBase = (
    props: IVirtualFramePreviewBaseProps,
) => (
    <div className={className} onClick={props.onClick}>
        {props.children}
    </div>
);
