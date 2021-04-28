import React from "react";
import style from "./style.module.css";

interface IVirtualFrameProps {
    children: React.ReactNode;
}

const className = style.virtualFrame;

export const VirtualFrame = (props: IVirtualFrameProps) => (
    <div className={className}>{props.children}</div>
);
