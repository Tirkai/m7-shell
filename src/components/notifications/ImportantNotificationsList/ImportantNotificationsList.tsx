import { SVGIcon } from "@algont/m7-ui";
import { empty } from "assets/icons";
import classNames from "classnames";
import { PlaceholderWithIcon } from "components/placeholder/PlaceholderWithIcon/PlaceholderWithIcon";
import { useStore } from "hooks/useStore";
import { strings } from "locale";
import { observer } from "mobx-react-lite";
import { Instruction } from "models/instruction/Instruction";
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

        const handleConfirm = (notification: NotificationModel) => {
            store.instruction.setShowInstruction(true);
            store.instruction.setInstruction(
                new Instruction({
                    notificationId: notification.id,
                    notificationTitle: notification.title,
                    notificationContent: notification.text,
                    instructionContent: notification.instruction,
                }),
            );
        };

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
                            onConfirm={() => handleConfirm(notification)}
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
