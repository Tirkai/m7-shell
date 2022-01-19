import { SVGIcon } from "@algont/m7-ui";
import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

const className = style.notificationHeader;

interface INotificationHeaderProps {
    icon?: string;
    title: string;
    hovered?: boolean;
    action?: React.ReactNode;
}

export const NotificationHeader = (props: INotificationHeaderProps) => {
    return (
        <div
            className={classNames(className, {
                [style.hovered]: props.hovered,
            })}
        >
            {props.icon && (
                <div className={style.icon}>
                    <SVGIcon
                        source={props.icon}
                        color="white"
                        size={{ width: "16px", height: "16px" }}
                    />
                </div>
            )}
            <div className={style.title}>{props.title}</div>
            <div className={style.actions}>{props.action}</div>
        </div>
    );
};
