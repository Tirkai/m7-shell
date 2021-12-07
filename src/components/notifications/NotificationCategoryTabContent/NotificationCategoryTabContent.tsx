import classNames from "classnames";
import { NotificationTab } from "models/notification/NotificationTab";
import React from "react";
import style from "./style.module.css";

const className = style.notificationCategoryTabContent;

interface INotificationCategoryTabContentProps {
    children?: React.ReactNode;
    condition: NotificationTab;
    currentTab: NotificationTab;
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
