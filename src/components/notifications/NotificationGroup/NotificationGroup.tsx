import { cross } from "assets/icons";
import React, { Component } from "react";
import style from "./style.module.css";
interface INotificationGroup {
    icon: string;
    title: string;
    onClear: () => void;
}

export class NotificationGroup extends Component<INotificationGroup> {
    handleClearGroup = () => this.props.onClear();

    render() {
        return (
            <div className={style.notificationGroup}>
                <div className={style.header}>
                    <div className={style.title}>
                        <div className={style.icon}>
                            <img src={this.props.icon} alt="Notification" />
                        </div>
                        <div className={style.titleText}>
                            {this.props.title}
                        </div>
                    </div>
                    <div className={style.actions}>
                        <div
                            className={style.actionItem}
                            onClick={this.handleClearGroup}
                        >
                            <img src={cross} alt="Clear" />
                        </div>
                    </div>
                </div>
                <div className={style.content}>{this.props.children}</div>
            </div>
        );
    }
}
