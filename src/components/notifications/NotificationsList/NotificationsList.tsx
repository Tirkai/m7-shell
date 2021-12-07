import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

const className = style.notificationsList;

interface INotificationsListProps {
    children?: React.ReactNode;
}

export const NotificationsList = (props: INotificationsListProps) => {
    return <div className={classNames(className)}>{props.children}</div>;
};
