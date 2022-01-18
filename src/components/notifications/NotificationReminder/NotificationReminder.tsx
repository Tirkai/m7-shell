import classNames from "classnames";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { NotificationBell } from "../NotificationBell/NotificationBell";
import style from "./style.module.css";

interface INotificationReminderProps {
    active: boolean;
}

export const NotificationReminder = observer(
    (props: INotificationReminderProps) => {
        const store = useStore();
        const { config } = store.config;
        const [isVisible, setVisible] = useState(true);

        const handleMouseEnter = () => {
            if (!isVisible) {
                return;
            }

            setVisible(false);

            setTimeout(() => {
                setVisible(true);
            }, config.properties.layers.notificationReminder.delay);
        };

        return (
            <div
                className={classNames(style.notificationReminder, {
                    [style.isActive]: isVisible && props.active,
                })}
                onMouseEnter={handleMouseEnter}
            >
                <div className={style.container}>
                    <div className={style.icon}>
                        <NotificationBell />
                    </div>
                    <div className={style.content}>
                        У вас есть непрочитанные уведомления требующие
                        подтверждения
                    </div>
                </div>
            </div>
        );
    },
);
