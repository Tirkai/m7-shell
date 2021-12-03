import classNames from "classnames";
import { observer } from "mobx-react";
import React from "react";
import { NotificationConfirm } from "../NotificationConfirm/NotificationConfirm";
import { NotificationDate } from "../NotificationDate/NotificationDate";
import { NotificationHeader } from "../NotificationHeader/NotificationHeader";
import { NotificationInstruction } from "../NotificationInstruction/NotificationInstruction";
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
    onClose: () => void;
    onClick: () => void;
}

export const NotificationCard = observer((props: INotificationCardProps) => {
    const handleClick = () => {
        props.onClick();
        props.onClose();
    };

    const handleClose = () => {
        // event.stopPropagation();
        props.onClose();
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
                        onConfirm={() => alert("CONFIRM")}
                        isShow={props.isRequireConfirm}
                    />
                </div>
                <NotificationInstruction
                    isShow={props.hasInstruction}
                    title="Инструкция"
                    content={props.instruction}
                />
            </div>
            {/* <div className={style.container}>
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
            </div> */}
        </div>
    );
});
