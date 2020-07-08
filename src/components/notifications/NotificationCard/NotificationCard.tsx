import { cross } from "assets/icons";
import React, { Component } from "react";
import style from "./style.module.css";

interface INotificationCardProps {
    text: string;
    title: string;
    onClose: () => void;
    onClick: () => void;
}

export class NotificationCard extends Component<INotificationCardProps> {
    handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        this.props.onClick();
    };

    handleClose = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        this.props.onClose();
    };

    render() {
        return (
            <div className={style.notificationCard} onClick={this.handleClick}>
                <div className={style.container}>
                    <div className={style.header}>
                        <div className={style.title}>{this.props.title}</div>
                        <div className={style.actions}>
                            <div
                                className={style.actionItem}
                                onClick={this.handleClose}
                            >
                                <img src={cross} alt="Close" />
                            </div>
                        </div>
                    </div>
                    <div className={style.content}>
                        <div className={style.text}>{this.props.text}</div>
                    </div>
                </div>
            </div>
        );
    }
}
