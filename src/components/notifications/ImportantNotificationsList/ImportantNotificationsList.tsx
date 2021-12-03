import classNames from "classnames";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { NotificationModel } from "models/notification/NotificationModel";
import React from "react";
import { NotificationCard } from "../NotificationCard/NotificationCard";
import style from "./style.module.css";

const className = style.importantNotificationsList;

interface IImportantNotificationsListProps {
    children?: React.ReactNode;
    onCloseNotification: (notification: NotificationModel) => void;
    onRunApplication: (appId: string, url: string) => void;
}

export const ImportantNotificationsList = observer(
    (props: IImportantNotificationsListProps) => {
        const store = useStore();

        return (
            <div className={classNames(className)}>
                {store.notification.importantNotifications.map(
                    (notification) => (
                        <NotificationCard
                            key={notification.id}
                            {...notification}
                            hasInstruction={notification.hasInstruction}
                            onClick={() =>
                                props.onRunApplication(
                                    notification.applicationId,
                                    notification.url,
                                )
                            }
                            onClose={() =>
                                props.onCloseNotification(notification)
                            }
                        />
                    ),
                )}
            </div>
        );
    },
);
