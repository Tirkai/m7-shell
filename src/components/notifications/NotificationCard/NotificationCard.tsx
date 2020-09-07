import { cross } from "assets/icons";
import classNames from "classnames";
import moment from "moment";
import React, { Component } from "react";
import style from "./style.module.css";

interface INotificationCardProps {
    text: string;
    title: string;
    date: string;
    isDisplayed: boolean;
    onClose: () => void;
    onClick: () => void;
}

export class NotificationCard extends Component<INotificationCardProps> {

    handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        this.props.onClick();
        this.props.onClose();
    };

    handleClose = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        this.props.onClose();
    };
    render() {
        const localizedDate = moment(this.props.date).fromNow();
        return (
            <div
                className={classNames(style.notificationCard, {
                    [style.isRemoving]: !this.props.isDisplayed,
                })}
                onClick={this.handleClick}
            >
                <div className={style.container}>
                    <div className={style.header}>
                        <div className={style.actions}>
                            <div
                                className={style.actionItem}
                                onClick={this.handleClose}
                            >
                                <img src={cross} alt="Close" />
                            </div>
                        </div>
                    </div>
                    {this.props.title.length ? (
                        <div className={style.title}>{this.props.title}</div>
                    ) : (
                        ""
                    )}
                    {this.props.text ? (
                        <div className={style.content}>
                            <div className={style.text}>{this.props.text}</div>
                        </div>
                    ) : (
                        ""
                    )}
                    <div className={style.date}>
                        <div className={style.text}>{localizedDate}</div>
                    </div>
                </div>
            </div>
        );
    }
}
