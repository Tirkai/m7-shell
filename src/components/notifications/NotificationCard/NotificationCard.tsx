import React, { Component } from "react";
import style from "./style.module.css";

interface INotificationCardProps {
    text: string;
    title: string;
}

export class NotificationCard extends Component<INotificationCardProps> {
    render() {
        return (
            <div className={style.notificationCard}>
                <div className={style.container}>
                    <div className={style.header}>
                        <div className={style.title}>{this.props.title}</div>
                    </div>
                    <div className={style.content}>
                        <div className={style.text}>{this.props.text}</div>
                    </div>
                </div>
            </div>
        );
    }
}
