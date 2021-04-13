import { SVGIcon } from "@algont/m7-ui";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import { empty } from "assets/icons";
import classNames from "classnames";
import { PlaceholderWithIcon } from "components/placeholder/PlaceholderWithIcon/PlaceholderWithIcon";
import { NOTIFICATION_APP_GUID } from "constants/config";
import { PerformanceContext } from "contexts/PerformanceContext";
import { ShellPanelType } from "enum/ShellPanelType";
import { useStore } from "hooks/useStore";
import { strings } from "locale";
import { observer } from "mobx-react";
import { ApplicationProcess } from "models/ApplicationProcess";
import { ApplicationWindow } from "models/ApplicationWindow";
import { ExternalApplication } from "models/ExternalApplication";
import { NotificationGroupModel } from "models/NotificationGroupModel";
import { NotificationModel } from "models/NotificationModel";
import React, { useContext, useEffect, useState } from "react";
import { NotificationCard } from "../NotificationCard/NotificationCard";
import { NotificationGroup } from "../NotificationGroup/NotificationGroup";
import style from "./style.module.css";

export const NotificationHub = observer(() => {
    const store = useStore();
    const performanceMode = useContext(PerformanceContext);
    const [isScrolled, setScrolled] = useState(false);

    const [showClearGroupDialog, setShowClearGroupDialog] = useState<{
        isShow: boolean;
        group: NotificationGroupModel | null;
    }>({ isShow: false, group: null });

    const connectNotifications = async () => {
        await store.notification.fetchApps(store.auth.userLogin);
        await store.notification.fetchTotalCount(store.auth.userLogin);
        store.notification.fetchNotifications(store.auth.userLogin);

        store.notification.connectToNotificationsSocket(store.auth.accessToken);
    };

    const disconnectNotifications = () => {
        store.notification.disconnectFromNotificationsSocket();
    };

    useEffect(() => {
        connectNotifications();
        return () => disconnectNotifications();
    }, []);

    const handleClearGroup = async (group: NotificationGroupModel | null) => {
        setShowClearGroupDialog({ isShow: false, group: null });
        if (group) {
            group.setFetching(true);
            try {
                await store.notification.removeNotificationsByGroup(
                    group,
                    store.auth.userLogin,
                );

                await store.notification.fetchGroup(
                    group,
                    store.auth.userLogin,
                );
                group.setFetching(false);
            } catch (e) {
                group.setFetching(false);

                console.error(e);
            }
        }
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

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        if (isScrolled && event.currentTarget.scrollTop <= 0) {
            setScrolled(false);
        }
        if (!isScrolled && event.currentTarget.scrollTop > 0) {
            setScrolled(true);
        }
    };

    const handleRunApplication = (appId: string, url: string) => {
        const app = store.applicationManager.findById(appId);

        if (app instanceof ExternalApplication && url.length) {
            store.shell.setActivePanel(ShellPanelType.None);

            if (!app.isExecuted) {
                const appProcess = new ApplicationProcess({
                    app,
                    window: new ApplicationWindow(),
                    url,
                });
                store.processManager.execute(appProcess);
            } else {
                const activeProcess = store.processManager.findProcessByApp(
                    app,
                );
                if (activeProcess) {
                    activeProcess.setUrl(url);
                    store.windowManager.focusWindow(activeProcess.window);
                }
            }
        } else {
            console.warn("Try run application with empty URL");
        }
    };

    const handleOpenNotificationGroup = (group: NotificationGroupModel) => {
        const notificationApp = store.applicationManager.findById(
            NOTIFICATION_APP_GUID,
        );
        if (notificationApp) {
            if (!notificationApp.isExecuted) {
                const appProcess = new ApplicationProcess({
                    app: notificationApp,
                    window: new ApplicationWindow(),
                    params: new Map([["filterByAppId", group.id]]),
                });
                store.processManager.execute(appProcess);
            } else {
                const activeProcess = store.processManager.findProcessByApp(
                    notificationApp,
                );
                if (activeProcess) {
                    activeProcess.setParams(
                        new Map([["filterByAppId", group.id]]),
                    );
                    store.windowManager.focusWindow(activeProcess.window);
                }
            }
        }
    };

    return (
        <div
            className={classNames(style.notificationHub, {
                [style.show]: store.shell.notificationHubShow,
            })}
        >
            <div className={style.container}>
                <div className={style.content}>
                    <div
                        className={classNames(style.title, {
                            [style.titleAfterScroll]: isScrolled,
                        })}
                    >
                        {strings.notification.title}
                    </div>
                    <div
                        className={style.notificationsList}
                        onScroll={handleScroll}
                    >
                        {store.notification.groups
                            .filter((group) => group.hasNotifications)
                            .map((group) => (
                                <NotificationGroup
                                    key={group.id}
                                    onClear={() =>
                                        setShowClearGroupDialog({
                                            isShow: true,
                                            group,
                                        })
                                    }
                                    onTitleClick={() =>
                                        handleOpenNotificationGroup(group)
                                    }
                                    icon={group.icon}
                                    title={group.name}
                                    count={group.count}
                                    isFetching={
                                        group.isFetching || group.isLocked
                                    }
                                >
                                    {group.notifications.map((notification) => (
                                        <NotificationCard
                                            key={notification.id}
                                            {...notification}
                                            onClick={() =>
                                                handleRunApplication(
                                                    notification.applicationId,
                                                    notification.url,
                                                )
                                            }
                                            onClose={() =>
                                                handleCloseNotification(
                                                    notification,
                                                )
                                            }
                                        />
                                    ))}
                                </NotificationGroup>
                            ))}
                        {store.notification.groups.every(
                            (group) => !group.hasNotifications,
                        ) &&
                            store.notification.groups.every(
                                (group) => !group.isFetching,
                            ) && (
                                <PlaceholderWithIcon
                                    icon={
                                        <SVGIcon source={empty} color="white" />
                                    }
                                    content={
                                        strings.notification.noMoreNotifications
                                    }
                                />
                            )}
                    </div>
                </div>
            </div>
            {/* TODO: locale */}
            <Dialog
                fullWidth
                open={showClearGroupDialog.isShow}
                onClose={() =>
                    setShowClearGroupDialog({ isShow: false, group: null })
                }
            >
                <DialogTitle>Удалить все уведомления в группе?</DialogTitle>
                <DialogContent>
                    Данное действие невозможно отменить
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            handleClearGroup(showClearGroupDialog.group);
                        }}
                    >
                        Удалить
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() =>
                            setShowClearGroupDialog({
                                isShow: false,
                                group: null,
                            })
                        }
                    >
                        Отмена
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
});
