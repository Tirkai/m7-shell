import classNames from "classnames";
import { ShellPanelType } from "enum/ShellPanelType";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { ExternalApplication } from "models/ExternalApplication";
import { NotificationModel } from "models/NotificationModel";
import { ToastNotification } from "models/ToastNotification";
import React from "react";
import { NotificationCard } from "../NotificationCard/NotificationCard";
import style from "./style.module.css";

export const NotificationToasts = observer(() => {
    const store = useStore();
    const handleRunApplication = (toast: ToastNotification) => {
        const app = store.applicationManager.findById(
            toast.notification.applicationId,
        );
        if (app instanceof ExternalApplication) {
            store.shell.setActivePanel(ShellPanelType.None);

            const runner = new ApplicationRunner(store);

            runner.run(app, {
                url: toast.notification.url,
                focusWindowAfterInstantiate: true,
            });
        }

        toast.setShow(false);
        handleRemoveNotification(toast.notification);
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

    const handleRemoveNotification = (notification: NotificationModel) => {
        store.notification.removeNotifications(
            [notification.id],
            store.auth.userLogin,
        );
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
                        onClick={() => handleRunApplication(item)}
                        onClose={() => handleClose(item)}
                    />
                </div>
            ))}
        </div>
    );
});

export default NotificationToasts;
