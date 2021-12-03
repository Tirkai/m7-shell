import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

const className = style.notificationText;

interface INotificationTextProps {
    text: string;
}

export const NotificationText = (props: INotificationTextProps) => {
    return <div className={classNames(className)}>{props.text}</div>;
};
