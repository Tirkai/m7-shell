import { SVGIcon } from "@algont/m7-ui";
import { cross } from "assets/icons";
import classNames from "classnames";
import React from "react";
import style from "./style.module.css";
interface INotificationGroupProps {
    icon: string;
    title: string;
    count?: number;
    children: React.ReactNode;
    onClear: () => void;
    onTitleClick: () => void;
    overlay: React.ReactNode | null;
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
                <div
                    className={classNames(style.actions, {
                        [style.disabledActions]: props.overlay !== null,
                    })}
                >
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

                <div
                    className={classNames(style.overlay, {
                        [style.show]: props.overlay !== null,
                    })}
                >
                    {props.overlay}
                </div>
            </div>
        </div>
    );
};
