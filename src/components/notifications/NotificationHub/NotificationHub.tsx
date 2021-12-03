import classNames from "classnames";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { ExternalApplication } from "models/app/ExternalApplication";
import { NotificationModel } from "models/notification/NotificationModel";
import { NotificationTab } from "models/notification/NotificationTab";
import { ShellPanelType } from "models/panel/ShellPanelType";
import React, { useEffect } from "react";
import { CommonNotificationsList } from "../CommonNotificationsList/CommonNotificationsList";
import { ImportantNotificationsList } from "../ImportantNotificationsList/ImportantNotificationsList";
import { InstructionDialog } from "../InstructionDialog/InstructionDialog";
import { NotificationHubHeader } from "../NotificationHubHeader/NotificationHubHeader";
import { NotificationsList } from "../NotificationsList/NotificationsList";
import style from "./style.module.css";

export const NotificationHub = observer(() => {
    const store = useStore();

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

    // const handleDeleteNotifications = (
    //     group: NotificationGroupModel | null,
    //     type: NotificationDeletionType,
    // ) => {
    //     if (group) {
    //         if (type === NotificationDeletionType.DeleteVisible) {
    //             handleClearVisibleNotifications(group);
    //         }
    //         if (type === NotificationDeletionType.DeleteAll) {
    //             handleClearGroup(group);
    //         }
    //         setDeletionType(NotificationDeletionType.DeleteVisible);
    //     }
    // };

    // const handleClearGroup = async (group: NotificationGroupModel | null) => {
    //     setShowClearGroupDialog({ isShow: false, group: null });
    //     if (group) {
    //         group.setFetching(true);
    //         try {
    //             await store.notification.removeNotificationsByGroup(
    //                 group,
    //                 store.auth.userLogin,
    //             );

    //             await store.notification.fetchGroup(
    //                 group,
    //                 store.auth.userLogin,
    //             );
    //         } catch (e) {
    //             console.error(e);
    //         } finally {
    //             group.setFetching(false);
    //         }
    //     }
    // };

    // const handleClearVisibleNotifications = async (
    //     group: NotificationGroupModel | null,
    // ) => {
    //     if (group) {
    //         setShowClearGroupDialog({
    //             isShow: false,
    //             group: null,
    //         });
    //         group.setFetching(true);
    //         try {
    //             await store.notification.removeNotifications(
    //                 group.notifications.map((item) => item.id),
    //                 store.auth.userLogin,
    //             );
    //         } catch (e) {
    //             console.error(e);
    //         } finally {
    //             group.setFetching(false);
    //         }
    //     }
    // };

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

    // const handleOpenNotificationGroup = (group: NotificationGroupModel) => {
    //     const notificationApp = store.applicationManager.findById(
    //         NOTIFICATION_APP_GUID,
    //     );

    //     const runner = new ApplicationRunner(store);

    //     if (notificationApp) {
    //         runner.run(notificationApp, {
    //             processOptions: {
    //                 params: new Map([["filterByAppId", group.id]]),
    //             },
    //             focusWindowAfterInstantiate: true,
    //         });
    //     }
    // };

    // const handleSetDeletionType = (
    //     event: React.ChangeEvent<HTMLInputElement>,
    // ) => {
    //     const value = event.target.value as NotificationDeletionType;
    //     setDeletionType(value);
    // };

    // const getGroupOverlay = (group: NotificationGroupModel) => {
    //     if (group.isFetching || group.isLocked) {
    //         return <CircularProgress color="secondary" />;
    //     }
    //     if (
    //         group.id === showClearGroupDialog?.group?.id &&
    //         showClearGroupDialog.isShow
    //     ) {
    //         return (
    //             <NotificationClearDialogContainer>
    //                 <PanelInformer>
    //                     <PanelInformerContent>
    //                         Удалить группу уведомлений?
    //                     </PanelInformerContent>
    //                     {group.count > 5 && (
    //                         <PanelInformerContent>
    //                             <RadioGroup
    //                                 color="primary"
    //                                 name="deleteChoose"
    //                                 value={deletionType}
    //                                 onChange={handleSetDeletionType}
    //                             >
    //                                 <FormControlLabel
    //                                     value={
    //                                         NotificationDeletionType.DeleteVisible
    //                                     }
    //                                     control={<Radio color="primary" />}
    //                                     label={
    //                                         "Удалить " +
    //                                         group.notifications.length +
    //                                         " уведомлений"
    //                                     }
    //                                 />

    //                                 <FormControlLabel
    //                                     value={
    //                                         NotificationDeletionType.DeleteAll
    //                                     }
    //                                     control={<Radio color="primary" />}
    //                                     label="Удалить все"
    //                                 />
    //                             </RadioGroup>
    //                         </PanelInformerContent>
    //                     )}

    //                     <PanelInformerActions>
    //                         <Button
    //                             onClick={() =>
    //                                 setShowClearGroupDialog({
    //                                     isShow: false,
    //                                     group: null,
    //                                 })
    //                             }
    //                         >
    //                             Отмена
    //                         </Button>
    //                         <Button
    //                             onClick={() => {
    //                                 handleDeleteNotifications(
    //                                     showClearGroupDialog.group,
    //                                     deletionType,
    //                                 );
    //                             }}
    //                             classes={{ root: style.deletionButton }}
    //                         >
    //                             Удалить
    //                         </Button>
    //                     </PanelInformerActions>
    //                 </PanelInformer>
    //             </NotificationClearDialogContainer>
    //         );
    //     }

    //     return null;
    // };

    useEffect(onMount, []);

    return (
        <div
            className={classNames(style.notificationHub, {
                [style.show]: store.panelManager.notificationHubShow,
            })}
        >
            <div className={style.container}>
                <div className={style.content}>
                    <NotificationHubHeader />
                    <NotificationsList>
                        {store.notification.tab === NotificationTab.All && (
                            <CommonNotificationsList
                                onCloseNotification={handleCloseNotification}
                                onRunApplication={handleRunApplication}
                            />
                        )}
                        {store.notification.tab ===
                            NotificationTab.Important && (
                            <ImportantNotificationsList
                                onCloseNotification={handleCloseNotification}
                                onRunApplication={handleRunApplication}
                            />
                        )}

                        {/* {store.notification.groups
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
                            )} */}
                    </NotificationsList>
                </div>
            </div>
            <InstructionDialog
                text={store.notification.instructionText}
                open={store.notification.isShowInstruction}
                onClose={() => store.notification.showInstruction(false)}
            />
        </div>
    );
});

export default NotificationHub;
