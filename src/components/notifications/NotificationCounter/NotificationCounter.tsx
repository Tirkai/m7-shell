import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

const className = style.notificationCounter;

interface INotificationCounterProps {
    count: number;
}

export const NotificationCounter = (props: INotificationCounterProps) => {
    const isBigNumber = props.count >= 100;
    const value = !isBigNumber ? props.count : "99+";

    return (
        <div
            className={classNames(className, {
                [style.isBigNumber]: isBigNumber,
            })}
        >
            {value}
        </div>
    );
};
