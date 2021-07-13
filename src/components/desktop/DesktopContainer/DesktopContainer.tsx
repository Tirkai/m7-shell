import React from "react";
import style from "./style.module.css";

interface IDesktopContainerProps {
    children: React.ReactNode;
}

const className = style.desktopContainer;

export const DesktopContainer = (props: IDesktopContainerProps) => (
    <div className={className}>{props.children}</div>
);
