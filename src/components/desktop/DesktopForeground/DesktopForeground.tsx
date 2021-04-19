import React from "react";
import style from "./style.module.css";

interface IDesktopForegroundProps {
    onDesktopClick: () => void;
}

const className = style.desktopForeground;

export const DesktopForeground = (props: IDesktopForegroundProps) => (
    <div className={className} onClick={props.onDesktopClick}></div>
);
