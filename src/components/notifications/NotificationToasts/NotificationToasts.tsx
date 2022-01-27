import classNames from "classnames";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { ExternalApplication } from "models/app/ExternalApplication";
import { NotificationModel } from "models/notification/NotificationModel";
import { ToastNotification } from "models/notification/ToastNotification";
import { ShellPanelType } from "models/panel/ShellPanelType";
import React from "react";
import { NotificationCard } from "../NotificationCard/NotificationCard";
import style from "./style.module.css";

export const NotificationToasts = observer(() => {
    const store = useStore();

    const runApplication = (appId: string, url: string) => {
        const app = store.applicationManager.findById(appId);
        if (app instanceof ExternalApplication) {
            store.panelManager.setActivePanel(ShellPanelType.None);

            const runner = new ApplicationRunner(store);

            runner.run(app, {
                processOptions: {
                    url,
                },
                focusWindowAfterInstantiate: true,
            });
        }
    };

    const handleFadeOutAnimationEnd = (
        event: React.AnimationEvent<HTMLDivElement>,
        toast: ToastNotification,
    ) => {
        if (event.animationName === style.fadeOut) {
            store.notification.removeToast(toast);
        }
    };

    const handleClose = (toast: ToastNotification) => {
        toast.setShow(false);
        handleRemoveNotification(toast.notification);
    };

    const handleCollapse = (toast: ToastNotification) => {
        toast.setShow(false);
    };

    const handleRemoveNotification = (notification: NotificationModel) => {
        store.notification.removeNotifications(
            [notification.id],
            store.auth.userLogin,
        );
    };

    const handleConfirm = async (
        notification: NotificationModel,
        toast: ToastNotification,
    ) => {
        await store.notification.confirmUserNotifications(
            [notification.id],
            store.auth.userLogin,
        );

        toast.setShow(false);
    };

    const handleConfirmAndDrop = async (
        notification: NotificationModel,
        toast: ToastNotification,
    ) => {
        const confirmResponse =
            await store.notification.confirmUserNotifications(
                [notification.id],
                store.auth.userLogin,
            );

        if (confirmResponse.error) {
            return;
        }

        await store.notification.removeNotifications(
            [notification.id],
            store.auth.userLogin,
        );

        toast.setShow(false);
    };

    const handleNotificationCardClick = (toast: ToastNotification) => {
        runApplication(
            toast.notification.applicationId,
            toast.notification.url,
        );

        if (toast.notification.isRequireConfirm) {
            return;
        }
        toast.setShow(false);
        handleRemoveNotification(toast.notification);
    };

    return (
        <div className={style.notificationToasts}>
            {store.notification.toasts.map((item) => (
                <div
                    key={item.notification.id}
                    className={classNames(style.toastItem, {
                        [style.isHidden]: !item.isShow,
                    })}
                    onAnimationEnd={(event) =>
                        handleFadeOutAnimationEnd(event, item)
                    }
                >
                    <NotificationCard
                        {...item.notification}
                        onClick={() => handleNotificationCardClick(item)}
                        onClose={() => handleClose(item)}
                        onCollapse={() => handleCollapse(item)}
                        closeAfterClick={!item.notification.isRequireConfirm}
                        onConfirm={() => handleConfirm(item.notification, item)}
                        onConfirmAndDrop={() =>
                            handleConfirmAndDrop(item.notification, item)
                        }
                    />
                </div>
            ))}
        </div>
    );
});

export default NotificationToasts;
