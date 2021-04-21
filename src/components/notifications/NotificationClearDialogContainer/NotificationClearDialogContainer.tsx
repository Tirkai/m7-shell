import React from "react";
import style from "./style.module.css";

interface INotificationClearDialogContainerProps {
    children: React.ReactNode;
}

const className = style.notificationClearDialogContainer;

export const NotificationClearDialogContainer = (
    props: INotificationClearDialogContainerProps,
) => <div className={className}>{props.children}</div>;
