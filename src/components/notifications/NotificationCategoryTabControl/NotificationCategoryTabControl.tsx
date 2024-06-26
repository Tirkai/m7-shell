import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

const className = style.notificationCategoryTabControl;

interface INotificationCategoryTabControlProps {
    label: React.ReactNode;
    icon?: React.ReactNode;
    active?: boolean;
    onClick: () => void;
}

export const NotificationCategoryTabControl = (
    props: INotificationCategoryTabControlProps,
) => {
    return (
        <div
            className={classNames(className, { [style.active]: props.active })}
            onClick={props.onClick}
        >
            {props.icon && <div className={style.icon}>{props.icon}</div>}
            <div className={style.label}>{props.label}</div>
        </div>
    );
};
