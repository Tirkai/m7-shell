import classNames from "classnames";
import React from "react";
import { NotificationConfirm } from "../NotificationConfirm/NotificationConfirm";
import { NotificationDate } from "../NotificationDate/NotificationDate";
import { NotificationHeader } from "../NotificationHeader/NotificationHeader";
import { NotificationText } from "../NotificationText/NotificationText";
import style from "./style.module.css";

interface INotificationCardProps {
    icon?: string;
    text: string;
    title: string;
    date: string;
    isRequireConfirm: boolean;
    isDisplayed: boolean;
    instruction: string;
    hasInstruction: boolean;
    closeAfterClick?: boolean;
    onClose?: () => void;
    onClick: () => void;
    onConfirm?: () => void;
}

export const NotificationCard = (props: INotificationCardProps) => {
    const handleClick = () => {
        props.onClick();
        if (props.closeAfterClick) {
            handleClose();
        }
    };

    const handleClose = () => {
        // event.stopPropagation();
        if (props.onClose) {
            props.onClose();
        }
    };

    const handleConfirm = () => {
        if (props.onConfirm) {
            props.onConfirm();
        }
    };

    return (
        <div
            className={classNames(style.notificationCard, {
                [style.isRemoving]: !props.isDisplayed,
            })}
        >
            <div className={style.container}>
                <div className={style.content}>
                    <div className={style.activeArea} onClick={handleClick}>
                        <NotificationHeader
                            icon={props.icon}
                            title={props.title}
                            onClose={handleClose}
                            disableCloseAction={props.isRequireConfirm}
                        />
                        <NotificationText text={props.text} />
                        <NotificationDate date={props.date} />
                    </div>
                    <NotificationConfirm
                        onConfirm={handleConfirm}
                        isShow={props.isRequireConfirm}
                    />
                </div>
            </div>
        </div>
    );
};
