import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

interface IDisplayModeChooseItemProps {
    children: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
}

const className = style.displayModeChooseItem;

export const DisplayModeChooseItem = (props: IDisplayModeChooseItemProps) => (
    <div
        className={classNames(className, { [style.active]: props.active })}
        onClick={props.onClick}
    >
        {props.children}
    </div>
);
