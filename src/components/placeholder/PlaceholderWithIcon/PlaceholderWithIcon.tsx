import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

const className = style.placeholderWithIcon;

interface IPlaceholderWithIconProps {
    icon: JSX.Element;
    content: string;
}

export const PlaceholderWithIcon = (props: IPlaceholderWithIconProps) => (
    <div className={classNames(className)}>
        <div className={style.icon}>{props.icon}</div>
        <div className={style.content}>{props.content}</div>
    </div>
);
