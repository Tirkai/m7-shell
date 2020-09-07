import { SVGIcon } from "@algont/m7-ui";
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
                            <SVGIcon source={this.props.icon} color="white" />
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
                            <SVGIcon source={cross} color="white" />
                        </div>
                    </div>
                </div>
                <div className={style.content}>{this.props.children}</div>
            </div>
        );
    }
}
