import React from "react";
import style from "./style.module.css";

interface IDisplayModeChooseItemProps {
    children: React.ReactNode;
    onClick?: () => void;
}

const className = style.displayModeChooseItem;

export const DisplayModeChooseItem = (props: IDisplayModeChooseItemProps) => (
    <div className={className} onClick={props.onClick}>
        {props.children}
    </div>
);
