import classNames from "classnames";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { ExternalApllication } from "models/ExternalApplication";
import { NotificationModel } from "models/NotificationModel";
import { ToastNotification } from "models/ToastNotification";
import React, { Component } from "react";
import { NotificationCard } from "../NotificationCard/NotificationCard";
import style from "./style.module.css";

@inject("store")
@observer
export class NotificationToasts extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    handleRunApplication = (toast: ToastNotification) => {
        const app = this.store.applicationManager.findById(
            toast.notification.applicationId,
        );
        if (app instanceof ExternalApllication) {
            this.store.applicationManager.executeApplicationWithUrl(
                app,
                toast.notification.url,
            );
        }
        toast.setShow(false);
        this.handleRemoveNotification(toast.notification);
    };

    handleFadeOutAnimationEnd = (
        event: React.AnimationEvent<HTMLDivElement>,
        toast: ToastNotification,
    ) => {
        if (event.animationName === style.fadeOut) {
            this.store.notification.removeToast(toast);
        }
    };

    handleClose = (toast: ToastNotification) => {
        toast.setShow(false);
        this.handleRemoveNotification(toast.notification);
    };

    handleRemoveNotification = (notification: NotificationModel) => {
        this.store.notification.removeNotifications(
            [notification],
            this.store.auth.userLogin,
        );
    };

    render() {
        return (
            <div className={style.notificationToasts}>
                {this.store.notification.toasts.map((item) => (
                    <div
                        key={item.notification.id}
                        className={classNames(style.toastItem, {
                            [style.isHidden]: !item.isShow,
                        })}
                        onAnimationEnd={(event) =>
                            this.handleFadeOutAnimationEnd(event, item)
                        }
                    >
                        <NotificationCard
                            {...item.notification}
                            onClick={() => this.handleRunApplication(item)}
                            onClose={() => this.handleClose(item)}
                        />
                    </div>
                ))}
            </div>
        );
    }
}
