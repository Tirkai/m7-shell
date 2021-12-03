import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

const className = style.notificationCategoryTabs;

interface INotificationCategoryTabsProps {
    children?: React.ReactNode;
}

export const NotificationCategoryTabs = (
    props: INotificationCategoryTabsProps,
) => {
    return (
        <div className={classNames(className)}>
            <div className={style.container}>{props.children}</div>
        </div>
    );
};
