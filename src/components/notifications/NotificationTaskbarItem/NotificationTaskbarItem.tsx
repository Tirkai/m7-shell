import { SVGIcon } from "@algont/m7-ui";
import { error, notifications, notificationsNone } from "assets/icons";
import classNames from "classnames";
import { NotificationServiceConnectStatus } from "enum/NotificationServiceConnectStatus";
import React, { Component } from "react";
import style from "./style.module.css";

const className = style.notificationTaskbarItem;

interface INotificationTaskbarItemProps {
    status: NotificationServiceConnectStatus;
    exist: boolean;
}

export class NotificationTaskbarItem extends Component<
    INotificationTaskbarItemProps
> {
    render() {
        return (
            <div className={classNames(className)}>
                {this.props.status ===
                NotificationServiceConnectStatus.Default ? (
                    <div className={style.statusDefault}>
                        <SVGIcon
                            key={"notificationsUnknown"}
                            source={notificationsNone}
                            color="white"
                        />
                    </div>
                ) : (
                    ""
                )}

                {this.props.status ===
                NotificationServiceConnectStatus.Connected ? (
                    <div className={style.statusConnected}>
                        {this.props.exist ? (
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
                ) : (
                    ""
                )}

                {this.props.status ===
                NotificationServiceConnectStatus.Disconnected ? (
                    <div className={style.statusDisconnected}>
                        <SVGIcon
                            key={"notificationsDisconnected"}
                            source={notificationsNone}
                            color="grey"
                        />
                        <div className={style.error}>
                            <img src={error} />
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </div>
        );
    }
}
