import { SVGIcon } from "@algont/m7-ui";
import { empty } from "assets/icons";
import classNames from "classnames";
import { PlaceholderWithIcon } from "components/placeholder/PlaceholderWithIcon/PlaceholderWithIcon";
import { useStore } from "hooks/useStore";
import { strings } from "locale";
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
    onConfirm: (notification: NotificationModel) => void;
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
                            onClick={() =>
                                props.onRunApplication(
                                    notification.applicationId,
                                    notification.url,
                                )
                            }
                            onConfirm={() => props.onConfirm(notification)}
                        />
                    ),
                )}
                {store.notification.importantNotifications.length <= 0 && (
                    <PlaceholderWithIcon
                        icon={<SVGIcon source={empty} color="white" />}
                        content={strings.notification.noMoreNotifications}
                    />
                )}
            </div>
        );
    },
);
