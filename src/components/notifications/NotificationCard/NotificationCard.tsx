import { IconButton } from "@material-ui/core";
import { collapse, cross } from "assets/icons";
import classNames from "classnames";
import React, { Fragment, useMemo, useState } from "react";
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
    closeAfterClick?: boolean;
    onClose?: () => void;
    onCollapse?: () => void;
    onClick: () => void;
    onConfirm?: () => void;
}

export const NotificationCard = (props: INotificationCardProps) => {
    const [isHovered, setHovered] = useState(false);

    const handleClick = () => {
        props.onClick();

        if (!props.closeAfterClick) {
            return;
        }

        if (!props.onClose) {
            return;
        }

        props.onClose();

        // if (props.closeAfterClick && props.onClose) {
        //     props.onClose();
        // }
    };

    const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();

        if (!props.onClose) {
            return;
        }
        props.onClose();
    };

    const handleCollapse = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        e.stopPropagation();
        if (!props.onCollapse) {
            return;
        }

        props.onCollapse();
    };

    const handleConfirm = () => {
        if (!props.onConfirm) {
            return;
        }

        props.onConfirm();
    };

    const notificationAction = useMemo(() => {
        if (props.isRequireConfirm) {
            if (!props.onCollapse) {
                return <Fragment />;
            }

            return (
                <div onClick={handleCollapse}>
                    <IconButton size="small">
                        <img src={collapse} alt="Collapse" />
                    </IconButton>
                </div>
            );
        } else {
            return (
                <div onClick={handleClose}>
                    <IconButton size="small">
                        <img src={cross} alt="Close" />
                    </IconButton>
                </div>
            );
        }
    }, [props.isRequireConfirm]);

    return (
        <div
            className={classNames(style.notificationCard, {
                [style.isRemoving]: !props.isDisplayed,
            })}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className={style.container}>
                <div className={style.content}>
                    <div className={style.activeArea} onClick={handleClick}>
                        <NotificationHeader
                            icon={props.icon}
                            title={props.title}
                            // onClose={handleClose}
                            action={notificationAction}
                            // disableCloseAction={props.isRequireConfirm}
                            hovered={isHovered}
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
