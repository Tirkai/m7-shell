import classNames from "classnames";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { ExternalApplication } from "models/app/ExternalApplication";
import { NotificationModel } from "models/notification/NotificationModel";
import { NotificationTab } from "models/notification/NotificationTab";
import { ShellPanelType } from "models/panel/ShellPanelType";
import React, { useEffect, useState } from "react";
import { CommonNotificationsList } from "../CommonNotificationsList/CommonNotificationsList";
import { ImportantNotificationsList } from "../ImportantNotificationsList/ImportantNotificationsList";
import { NotificationCategoryTabContent } from "../NotificationCategoryTabContent/NotificationCategoryTabContent";
import { NotificationHubHeader } from "../NotificationHubHeader/NotificationHubHeader";
import { NotificationsList } from "../NotificationsList/NotificationsList";
import style from "./style.module.css";

export const NotificationHub = observer(() => {
    const store = useStore();

    const [currentTab, setCurrentTab] = useState<NotificationTab>(
        NotificationTab.All,
    );

    const connectNotifications = async () => {
        await store.notification.fetchApps();
        await store.notification.fetchTotalCount();
        await store.notification.fetchInitialCounts();
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

    const handleSelectTab = (tab: NotificationTab) => {
        setCurrentTab(tab);
    };

    const handleConfirm = async (notification: NotificationModel) => {
        const response = await store.notification.confirmUserNotifications(
            [notification.id],
            store.auth.userLogin,
        );
        if (!response.error) {
            const group = store.notification.groups.find(
                (item) => item.id === notification.applicationId,
            );
            if (group) {
                store.notification.fetchGroup(group);
            }
        }
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

        const removeResponse = await store.notification.removeNotifications(
            [notification.id],
            store.auth.userLogin,
        );

        if (removeResponse.error) {
            return;
        }

        const group = store.notification.groups.find(
            (item) => item.id === notification.applicationId,
        );
        if (group) {
            store.notification.fetchGroup(group);
        }
    };

    useEffect(onMount, []);

    useEffect(() => {
        setCurrentTab(
            store.notification.hasImportantNotifcations
                ? NotificationTab.Important
                : NotificationTab.All,
        );
    }, [
        store.notification.hasImportantNotifcations,
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
                            condition={NotificationTab.All}
                        >
                            <CommonNotificationsList
                                onCloseNotification={handleCloseNotification}
                                onRunApplication={handleRunApplication}
                                onConfirm={handleConfirm}
                                onConfirmAndDrop={handleConfirmAndDrop}
                            />
                        </NotificationCategoryTabContent>
                        <NotificationCategoryTabContent
                            currentTab={currentTab}
                            condition={NotificationTab.Important}
                        >
                            <ImportantNotificationsList
                                onCloseNotification={handleCloseNotification}
                                onRunApplication={handleRunApplication}
                                onConfirm={handleConfirm}
                                onConfirmAndDrop={handleConfirmAndDrop}
                            />
                        </NotificationCategoryTabContent>
                    </NotificationsList>
                </div>
            </div>
            {/* <InstructionDialog
                instruction={store.instruction.instruction}
                show={store.instruction.isShowInstruction}
                onClose={() => store.instruction.setShowInstruction(false)}
                onConfirm={handleConfirm}
            /> */}
        </div>
    );
});

export default NotificationHub;
