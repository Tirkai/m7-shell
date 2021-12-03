import { SVGIcon } from "@algont/m7-ui";
import {
    Button,
    CircularProgress,
    FormControlLabel,
    Radio,
    RadioGroup,
} from "@material-ui/core";
import { empty } from "assets/icons";
import classNames from "classnames";
import { PanelInformer } from "components/informer/PanelInformer/PanelInformer";
import { PanelInformerActions } from "components/informer/PanelInformerActions/PanelInformerActions";
import { PanelInformerContent } from "components/informer/PanelInformerText/PanelInformerText";
import { PlaceholderWithIcon } from "components/placeholder/PlaceholderWithIcon/PlaceholderWithIcon";
import { NOTIFICATION_APP_GUID } from "constants/config";
import { useStore } from "hooks/useStore";
import { strings } from "locale";
import { observer } from "mobx-react";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { ExternalApplication } from "models/app/ExternalApplication";
import { NotificationGroupModel } from "models/notification/NotificationGroupModel";
import { NotificationModel } from "models/notification/NotificationModel";
import { ShellPanelType } from "models/panel/ShellPanelType";
import React, { useEffect, useState } from "react";
import { NotificationCard } from "../NotificationCard/NotificationCard";
import { NotificationClearDialogContainer } from "../NotificationClearDialogContainer/NotificationClearDialogContainer";
import { NotificationGroup } from "../NotificationGroup/NotificationGroup";
import { NotificationHubHeader } from "../NotificationHubHeader/NotificationHubHeader";
import style from "./style.module.css";

enum NotificationDeletionType {
    DeleteVisible = "visible",
    DeleteAll = "all",
}

export const NotificationHub = observer(() => {
    const store = useStore();
    const [isScrolled, setScrolled] = useState(false);

    const [showClearGroupDialog, setShowClearGroupDialog] = useState<{
        isShow: boolean;
        group: NotificationGroupModel | null;
    }>({
        isShow: false,
        group: null,
    });

    const [deletionType, setDeletionType] = useState(
        NotificationDeletionType.DeleteVisible,
    );

    const connectNotifications = async () => {
        await store.notification.fetchApps(store.auth.userLogin);
        await store.notification.fetchTotalCount(store.auth.userLogin);
        store.notification.fetchNotifications(store.auth.userLogin);

        store.notification.connectToNotificationsSocket(store.auth.accessToken);
    };

    const disconnectNotifications = () => {
        store.notification.disconnectFromNotificationsSocket();
    };

    const onMount = () => {
        connectNotifications();
        return () => disconnectNotifications();
    };

    const onChangeActivePanel = () => {
        if (store.panelManager.activePanel !== ShellPanelType.NotificationHub) {
            setShowClearGroupDialog({ isShow: false, group: null });
        }
    };

    const handleDeleteNotifications = (
        group: NotificationGroupModel | null,
        type: NotificationDeletionType,
    ) => {
        if (group) {
            if (type === NotificationDeletionType.DeleteVisible) {
                handleClearVisibleNotifications(group);
            }
            if (type === NotificationDeletionType.DeleteAll) {
                handleClearGroup(group);
            }
            setDeletionType(NotificationDeletionType.DeleteVisible);
        }
    };

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
            } catch (e) {
                console.error(e);
            } finally {
                group.setFetching(false);
            }
        }
    };

    const handleClearVisibleNotifications = async (
        group: NotificationGroupModel | null,
    ) => {
        if (group) {
            setShowClearGroupDialog({
                isShow: false,
                group: null,
            });
            group.setFetching(true);
            try {
                await store.notification.removeNotifications(
                    group.notifications.map((item) => item.id),
                    store.auth.userLogin,
                );
            } catch (e) {
                console.error(e);
            } finally {
                group.setFetching(false);
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

    const handleOpenNotificationGroup = (group: NotificationGroupModel) => {
        const notificationApp = store.applicationManager.findById(
            NOTIFICATION_APP_GUID,
        );

        const runner = new ApplicationRunner(store);

        if (notificationApp) {
            runner.run(notificationApp, {
                processOptions: {
                    params: new Map([["filterByAppId", group.id]]),
                },
                focusWindowAfterInstantiate: true,
            });
        }
    };

    const handleSetDeletionType = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = event.target.value as NotificationDeletionType;
        setDeletionType(value);
    };

    const getGroupOverlay = (group: NotificationGroupModel) => {
        if (group.isFetching || group.isLocked) {
            return <CircularProgress color="secondary" />;
        }
        if (
            group.id === showClearGroupDialog?.group?.id &&
            showClearGroupDialog.isShow
        ) {
            return (
                <NotificationClearDialogContainer>
                    <PanelInformer>
                        <PanelInformerContent>
                            Удалить группу уведомлений?
                        </PanelInformerContent>
                        {group.count > 5 && (
                            <PanelInformerContent>
                                <RadioGroup
                                    color="primary"
                                    name="deleteChoose"
                                    value={deletionType}
                                    onChange={handleSetDeletionType}
                                >
                                    <FormControlLabel
                                        value={
                                            NotificationDeletionType.DeleteVisible
                                        }
                                        control={<Radio color="primary" />}
                                        label={
                                            "Удалить " +
                                            group.notifications.length +
                                            " уведомлений"
                                        }
                                    />

                                    <FormControlLabel
                                        value={
                                            NotificationDeletionType.DeleteAll
                                        }
                                        control={<Radio color="primary" />}
                                        label="Удалить все"
                                    />
                                </RadioGroup>
                            </PanelInformerContent>
                        )}

                        <PanelInformerActions>
                            <Button
                                onClick={() =>
                                    setShowClearGroupDialog({
                                        isShow: false,
                                        group: null,
                                    })
                                }
                            >
                                Отмена
                            </Button>
                            <Button
                                onClick={() => {
                                    handleDeleteNotifications(
                                        showClearGroupDialog.group,
                                        deletionType,
                                    );
                                }}
                                classes={{ root: style.deletionButton }}
                            >
                                Удалить
                            </Button>
                        </PanelInformerActions>
                    </PanelInformer>
                </NotificationClearDialogContainer>
            );
        }

        return null;
    };

    useEffect(onMount, []);
    useEffect(onChangeActivePanel, [store.panelManager.activePanel]);

    return (
        <div
            className={classNames(style.notificationHub, {
                [style.show]: store.panelManager.notificationHubShow,
            })}
        >
            <div className={style.container}>
                <div className={style.content}>
                    <NotificationHubHeader isScrolled={isScrolled} />

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
                                    overlay={getGroupOverlay(group)}
                                >
                                    {group.notifications.map((notification) => (
                                        <NotificationCard
                                            key={notification.id}
                                            icon={group.icon}
                                            {...notification}
                                            hasInstruction={
                                                notification.hasInstruction
                                            }
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
        </div>
    );
});

export default NotificationHub;
