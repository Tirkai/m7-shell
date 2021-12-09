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
import { observer } from "mobx-react-lite";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { NotificationGroupModel } from "models/notification/NotificationGroupModel";
import { NotificationModel } from "models/notification/NotificationModel";
import { ShellPanelType } from "models/panel/ShellPanelType";
import React, { useEffect, useState } from "react";
import { NotificationCard } from "../NotificationCard/NotificationCard";
import { NotificationClearDialogContainer } from "../NotificationClearDialogContainer/NotificationClearDialogContainer";
import { NotificationGroup } from "../NotificationGroup/NotificationGroup";
import style from "./style.module.css";

const className = style.commonNotificationsList;

enum NotificationDeletionType {
    DeleteVisible = "visible",
    DeleteAll = "all",
}

interface ICommonNotificationsListProps {
    children?: React.ReactNode;
    onCloseNotification: (notification: NotificationModel) => void;
    onRunApplication: (appId: string, url: string) => void;
    onConfirm: (notification: NotificationModel) => void;
}

export const CommonNotificationsList = observer(
    (props: ICommonNotificationsListProps) => {
        const store = useStore();

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

        const handleClearGroup = async (
            group: NotificationGroupModel | null,
        ) => {
            setShowClearGroupDialog({ isShow: false, group: null });
            if (group) {
                group.setFetching(true);
                try {
                    await store.notification.removeNotificationsByGroup(
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

        const handleSetDeletionType = (
            event: React.ChangeEvent<HTMLInputElement>,
        ) => {
            const value = event.target.value as NotificationDeletionType;
            setDeletionType(value);
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

        const onChangeActivePanel = () => {
            if (
                store.panelManager.activePanel !==
                ShellPanelType.NotificationHub
            ) {
                setShowClearGroupDialog({ isShow: false, group: null });
            }
        };

        useEffect(onChangeActivePanel, [store.panelManager.activePanel]);

        return (
            <div className={classNames(className)}>
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
                                    // hasInstruction={notification.hasInstruction}
                                    closeAfterClick={
                                        !notification.isRequireConfirm
                                    }
                                    onClick={() =>
                                        props.onRunApplication(
                                            notification.applicationId,
                                            notification.url,
                                        )
                                    }
                                    onClose={() =>
                                        props.onCloseNotification(notification)
                                    }
                                    onConfirm={() =>
                                        props.onConfirm(notification)
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
                            icon={<SVGIcon source={empty} color="white" />}
                            content={strings.notification.noMoreNotifications}
                        />
                    )}
            </div>
        );
    },
);
