import { MarkerType, useMarker } from "@algont/m7-react-marker";
import { SVGIcon } from "@algont/m7-ui";
import { error, notifications, notificationsNone } from "assets/icons";
import classNames from "classnames";
import { TaskBarItemContainer } from "components/task/TaskBarItemContainer/TaskBarItemContainer";
import { NotificationServiceConnectStatus } from "enum/NotificationServiceConnectStatus";
import React, { useMemo } from "react";
import style from "./style.module.css";

const className = style.notificationTaskbarItem;

interface ITaskBarNotificationButtonProps {
    status: NotificationServiceConnectStatus;
    exist: boolean;
    onClick: () => void;
}

export const TaskBarNotificationButton = (
    props: ITaskBarNotificationButtonProps,
) => {
    const { createMemoizedMarker } = useMarker();

    const icon = useMemo(() => {
        if (props.status === NotificationServiceConnectStatus.Default) {
            return (
                <div className={style.statusDefault}>
                    <SVGIcon
                        key={"notificationsUnknown"}
                        source={notificationsNone}
                        color="white"
                    />
                </div>
            );
        }
        if (props.status === NotificationServiceConnectStatus.Connected) {
            return (
                <div className={style.statusConnected}>
                    {props.exist ? (
                        <SVGIcon
                            key={"notificationsExist"}
                            source={notifications}
                            color="white"
                        />
                    ) : (
                        <SVGIcon
                            key="notificationsNotExist"
                            source={notificationsNone}
                            color="white"
                        />
                    )}
                </div>
            );
        }
        if (props.status === NotificationServiceConnectStatus.Disconnected) {
            return (
                <div className={style.statusDisconnected}>
                    <SVGIcon
                        key={"notificationsDisconnected"}
                        source={notificationsNone}
                        color="grey"
                    />
                    <div className={style.error}>
                        <img src={error} alt="Disconnected" />
                    </div>
                </div>
            );
        }
    }, [props.status, props.exist]);

    return (
        <div
            className={classNames(className)}
            {...createMemoizedMarker(
                MarkerType.Element,
                "TaskBar.NotificationButton",
            )}
            onClick={props.onClick}
        >
            <TaskBarItemContainer>{icon}</TaskBarItemContainer>
        </div>
    );
};
