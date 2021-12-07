import classNames from "classnames";
import { InstructionFactory } from "factories/InstructionFactory";
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
    const handleRunApplication = (toast: ToastNotification) => {
        const app = store.applicationManager.findById(
            toast.notification.applicationId,
        );
        if (app instanceof ExternalApplication) {
            store.panelManager.setActivePanel(ShellPanelType.None);

            const runner = new ApplicationRunner(store);

            runner.run(app, {
                processOptions: {
                    url: toast.notification.url,
                },
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

    const handleShowInstruction = (
        toast: ToastNotification,
        notification: NotificationModel,
    ) => {
        store.instruction.setShowInstruction(true);
        store.instruction.setInstruction(
            InstructionFactory.createInstruction({ notification }),
        );
        toast.setShow(false);
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
                        closeAfterClick={!item.notification.isRequireConfirm}
                        onConfirm={() =>
                            handleShowInstruction(item, item.notification)
                        }
                    />
                </div>
            ))}
        </div>
    );
});

export default NotificationToasts;
