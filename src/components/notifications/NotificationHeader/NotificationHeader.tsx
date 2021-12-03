import { SVGIcon } from "@algont/m7-ui";
import { IconButton } from "@material-ui/core";
import { cross } from "assets/icons";
import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

const className = style.notificationHeader;

interface INotificationHeaderProps {
    icon?: string;
    title: string;
    onClose: () => void;
    disableCloseAction?: boolean;
}

export const NotificationHeader = (props: INotificationHeaderProps) => {
    const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        props.onClose();
    };

    return (
        <div className={classNames(className)}>
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
            <div className={style.actions}>
                {!props.disableCloseAction && (
                    <div onClick={handleClose}>
                        <IconButton size="small">
                            <img src={cross} alt="Close" />
                        </IconButton>
                    </div>
                )}
            </div>
        </div>
    );
};
