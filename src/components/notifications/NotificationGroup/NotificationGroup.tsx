import { SVGIcon } from "@algont/m7-ui";
import { CircularProgress } from "@material-ui/core";
import { cross } from "assets/icons";
import React from "react";
import style from "./style.module.css";
interface INotificationGroupProps {
    icon: string;
    title: string;
    count?: number;
    children: JSX.Element | JSX.Element[];
    isFetching?: boolean;
    onClear: () => void;
    onTitleClick: () => void;
}

export const NotificationGroup = (props: INotificationGroupProps) => {
    const handleClearGroup = () => props.onClear();

    return (
        <div className={style.notificationGroup}>
            <div className={style.header}>
                <div className={style.title} onClick={props.onTitleClick}>
                    <div className={style.icon}>
                        <SVGIcon source={props.icon} color="white" />
                    </div>
                    <div className={style.titleText}>{props.title}</div>
                    <div className={style.count}>{props.count}</div>
                </div>
                <div className={style.actions}>
                    <div
                        className={style.actionItem}
                        onClick={handleClearGroup}
                    >
                        <SVGIcon source={cross} color="white" />
                    </div>
                </div>
            </div>
            <div className={style.content}>
                {props.children}
                {props.isFetching && (
                    <div className={style.overlay}>
                        <CircularProgress color="secondary" />
                    </div>
                )}
            </div>
        </div>
    );
};
