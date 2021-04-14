import React from "react";
import style from "./style.module.css";

interface IDesktopPaneHeaderProps {
    title: string;
}

const className = style.desktopPaneHeader;

export const DesktopPaneHeader = (props: IDesktopPaneHeaderProps) => (
    <div className={className}>
        <div className={style.title}>{props.title}</div>
    </div>
);
