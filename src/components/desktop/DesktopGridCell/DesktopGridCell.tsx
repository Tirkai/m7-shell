import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

interface IDesktopGridCellProps {
    onClick?: () => void;
    onMouseEnter?: () => void;
    isActive?: boolean;
}

const className = style.desktopGridCell;

export const DesktopGridCell = (props: IDesktopGridCellProps) => (
    <div
        className={classNames(className, { [style.active]: props.isActive })}
        onClick={props.onClick}
        onMouseEnter={props.onMouseEnter}
    />
);
