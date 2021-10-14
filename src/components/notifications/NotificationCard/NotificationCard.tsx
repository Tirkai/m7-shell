import { cross } from "assets/icons";
import classNames from "classnames";
import { observer } from "mobx-react";
import moment from "moment";
import React from "react";
import style from "./style.module.css";

interface INotificationCardProps {
    text: string;
    title: string;
    date: string;
    isDisplayed: boolean;
    onClose: () => void;
    onClick: () => void;
}

export const NotificationCard = observer((props: INotificationCardProps) => {
    const handleClick = () => {
        props.onClick();
        props.onClose();
    };

    const handleClose = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        event.stopPropagation();
        props.onClose();
    };

    const localizedDate = moment(props.date).fromNow();
    return (
        <div
            className={classNames(style.notificationCard, {
                [style.isRemoving]: !props.isDisplayed,
            })}
            onClick={handleClick}
        >
            <div className={style.container}>
                <div className={style.header}>
                    <div className={style.actions}>
                        <div className={style.actionItem} onClick={handleClose}>
                            <img src={cross} alt="Close" />
                        </div>
                    </div>
                </div>
                {props.title.length && (
                    <div className={style.title}>{props.title}</div>
                )}
                {props.text && (
                    <div className={style.content}>
                        <div className={style.text}>{props.text}</div>
                    </div>
                )}
                <div className={style.date}>
                    <div className={style.text}>{localizedDate}</div>
                </div>
            </div>
        </div>
    );
});
