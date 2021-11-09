import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

interface IDesktopLayerProps {
    children: React.ReactNode;
    enabled: boolean;
    priority: number;
}

const className = style.desktopLayer;

export const DesktopLayer = (props: IDesktopLayerProps) => (
    <div className={classNames(className, { [style.enabled]: props.enabled })}>
        {props.children}
    </div>
);
