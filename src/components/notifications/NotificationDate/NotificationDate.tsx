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

    const formattedDate = moment(props.date).format("DD.MM.YYYY HH:mm:ss");

    return (
        <div className={classNames(className)}>
            <div className={style.container}>
                <div className={classNames(style.date, style.localizedDate)}>
                    {localizedDate}
                </div>
                <div className={classNames(style.date, style.formatedDate)}>
                    {formattedDate}
                </div>
            </div>
        </div>
    );
};
