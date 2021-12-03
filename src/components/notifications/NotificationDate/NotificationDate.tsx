import classNames from "classnames";
import moment from "moment";
import React from "react";
import style from "./style.module.css";

const className = style.notificationDate;

interface INotificationDateProps {
    date: string;
}

export const NotificationDate = (props: INotificationDateProps) => {
    const localizedDate = moment(props.date).fromNow();

    return <div className={classNames(className)}>{localizedDate}</div>;
};
