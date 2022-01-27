import classNames from "classnames";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { ExternalApplication } from "models/app/ExternalApplication";
import { NotificationCategoryType } from "models/notification/NotificationCategoryType";
import { NotificationModel } from "models/notification/NotificationModel";
import { ShellPanelType } from "models/panel/ShellPanelType";
import React, { useEffect, useState } from "react";
import { CommonNotificationsList } from "../CommonNotificationsList/CommonNotificationsList";
import { NotificationCategoryTabContent } from "../NotificationCategoryTabContent/NotificationCategoryTabContent";
import { NotificationHubHeader } from "../NotificationHubHeader/NotificationHubHeader";
import { NotificationsList } from "../NotificationsList/NotificationsList";
import style from "./style.module.css";

export const NotificationHub = observer(() => {
    const store = useStore();

    const [currentTab, setCurrentTab] = useState<NotificationCategoryType>(
        NotificationCategoryType.Common,
    );

    const connectNotifications = async () => {
        await store.notification.fetchApps();
        await store.notification.fetchTotalCount();
        await store.notification.fetchInitialNotifications();

        store.notification.connectToNotificationsSocket(store.auth.accessToken);
    };

    const disconnectNotifications = () => {
        store.notification.disconnectFromNotificationsSocket();
    };

    const onMount = () => {
        connectNotifications();
        return () => disconnectNotifications();
    };

    const handleCloseNotification = (notification: NotificationModel) => {
        notification.setDisplayed(false);
        setTimeout(() => {
            store.notification.removeNotifications(
                [notification.id],
                store.auth.userLogin,
            );
        }, 300);
    };

    const handleRunApplication = (appId: string, url: string) => {
        const app = store.applicationManager.findById(appId);

        if (app instanceof ExternalApplication && url.length) {
            store.panelManager.setActivePanel(ShellPanelType.None);

            const runner = new ApplicationRunner(store);
            runner.run(app, {
                processOptions: { url },
                focusWindowAfterInstantiate: true,
            });
        } else {
            console.warn("Try run application with empty URL");
        }
    };

    const handleSelectTab = (tab: NotificationCategoryType) => {
        setCurrentTab(tab);
    };

    const handleConfirm = async (notification: NotificationModel) => {
        await store.notification.confirmUserNotifications(
            [notification.id],
            store.auth.userLogin,
        );
    };

    const handleConfirmAndDrop = async (notification: NotificationModel) => {
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
    };

    useEffect(onMount, []);

    useEffect(() => {
        setCurrentTab(
            store.notification.hasConfirmationNotifcations
                ? NotificationCategoryType.Confirmation
                : NotificationCategoryType.Common,
        );
    }, [
        store.notification.hasConfirmationNotifcations,
        store.panelManager.activePanel,
    ]);

    return (
        <div
            className={classNames(style.notificationHub, {
                [style.show]: store.panelManager.notificationHubShow,
            })}
        >
            <div className={style.container}>
                <div className={style.content}>
                    <NotificationHubHeader
                        currentTab={currentTab}
                        onSelectTab={handleSelectTab}
                    />
                    <NotificationsList>
                        <NotificationCategoryTabContent
                            currentTab={currentTab}
                            condition={NotificationCategoryType.Common}
                        >
                            <CommonNotificationsList
                                onCloseNotification={handleCloseNotification}
                                onRunApplication={handleRunApplication}
                                onConfirm={handleConfirm}
                                onConfirmAndDrop={handleConfirmAndDrop}
                                category={store.notification.categories.get(
                                    NotificationCategoryType.Common,
                                )}
                            />
                        </NotificationCategoryTabContent>
                        <NotificationCategoryTabContent
                            currentTab={currentTab}
                            condition={NotificationCategoryType.Confirmation}
                        >
                            <CommonNotificationsList
                                onCloseNotification={handleCloseNotification}
                                onRunApplication={handleRunApplication}
                                onConfirm={handleConfirm}
                                onConfirmAndDrop={handleConfirmAndDrop}
                                category={store.notification.categories.get(
                                    NotificationCategoryType.Confirmation,
                                )}
                            />
                            {/* <ConfirmationNotificationsList
                                onCloseNotification={handleCloseNotification}
                                onRunApplication={handleRunApplication}
                                onConfirm={handleConfirm}
                                onConfirmAndDrop={handleConfirmAndDrop}
                            /> */}
                        </NotificationCategoryTabContent>
                    </NotificationsList>
                </div>
            </div>
        </div>
    );
});

export default NotificationHub;
