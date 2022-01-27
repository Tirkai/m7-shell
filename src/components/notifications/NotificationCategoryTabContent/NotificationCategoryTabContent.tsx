import classNames from "classnames";
import { NotificationCategoryType } from "models/notification/NotificationCategoryType";
import React from "react";
import style from "./style.module.css";

const className = style.notificationCategoryTabContent;

interface INotificationCategoryTabContentProps {
    children?: React.ReactNode;
    condition: NotificationCategoryType;
    currentTab: NotificationCategoryType;
}

export const NotificationCategoryTabContent = (
    props: INotificationCategoryTabContentProps,
) => {
    return (
        <div
            className={classNames(className, {
                [style.isActive]: props.condition === props.currentTab,
            })}
        >
            {props.children}
        </div>
    );
};
