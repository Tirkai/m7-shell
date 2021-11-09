import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

interface IDesktopLayoutProps {
    desktop: React.ReactNode;
    taskBar?: React.ReactNode;
}

const className = style.desktopLayout;

export const DesktopLayout = (props: IDesktopLayoutProps) => (
    <div className={classNames(className)}>
        <div className={style.desktop}>{props.desktop}</div>
        {props.taskBar && <div className={style.taskBar}>{props.taskBar}</div>}
    </div>
);
