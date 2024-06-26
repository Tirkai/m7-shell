import classNames from "classnames";
import { ConfigCondition } from "components/config/ConfigCondition/ConfigCondition";
import { NotificationCounter } from "components/notifications/NotificationCounter/NotificationCounter";
import { TaskBarNotificationButton } from "components/notifications/NotificationTaskbarItem/NotificationTaskbarItem";
import { useStore } from "hooks/useStore";
import { strings } from "locale";
import { observer } from "mobx-react";
import { NotificationServiceConnectStatus } from "models/notification/NotificationServiceConnectStatus";
import { ShellPanelType } from "models/panel/ShellPanelType";
import { ApplicationProcess } from "models/process/ApplicationProcess";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import hash from "object-hash";
import React from "react";
import { TaskBarAppsMenuButton } from "../TaskBarAppsMenuButton/TaskBarAppsMenuButton";
import { TaskBarBadge } from "../TaskBarBadge/TaskBarBadge";
import TaskBarDateTime from "../TaskBarDateTime/TaskBarDateTime";
import { TaskBarDevModeButton } from "../TaskBarDevModeButton/TaskBarDevModeButton";
import { TaskBarItem } from "../TaskBarItem/TaskBarItem";
import { TaskBarSoundButton } from "../TaskBarSoundButton/TaskBarSoundButton";
import { TaskBarViewportButton } from "../TaskBarViewportButton/TaskBarViewportButton";
import { TaskList } from "../TaskList/TaskList";
import style from "./style.module.css";

export const TaskBar = observer(() => {
    const store = useStore();

    const handleShowAppsMenu = (value: boolean) => {
        if (store.applicationManager.applications.length) {
            store.panelManager.setActivePanel(
                value ? ShellPanelType.StartMenu : ShellPanelType.None,
            );
        } else {
            store.message.showMessage(
                strings.error.noAvailableApplications,
                strings.error.failedGetAvailableApplications,
            );
        }
    };

    const handleFocusAppWindow = (appWindow: ApplicationWindow) => {
        store.windowManager.focusWindow(appWindow);
        if (appWindow instanceof ApplicationWindow) {
            if (appWindow.isCollapsed) {
                store.windowManager.expandWindow(appWindow);
            }
        }
    };

    const handleShowNotificationHub = (value: boolean) => {
        store.panelManager.setActivePanel(
            value ? ShellPanelType.NotificationHub : ShellPanelType.None,
        );
    };

    // TODO : Refactor
    const handleShowAudioHub = () => {
        store.panelManager.setActivePanel(
            store.panelManager.activePanel !== ShellPanelType.AudioHub
                ? ShellPanelType.AudioHub
                : ShellPanelType.None,
        );
    };

    const handleKillProcess = (appProcess: ApplicationProcess) => {
        store.processManager.closeProcess(appProcess);
    };

    const handleShowVirtualHub = () => {
        store.panelManager.setActivePanel(
            store.panelManager.activePanel !== ShellPanelType.Virtual
                ? ShellPanelType.Virtual
                : ShellPanelType.None,
        );
    };

    const handleShowDevModeHub = () => {
        store.panelManager.setActivePanel(
            store.panelManager.activePanel !== ShellPanelType.DevModeHub
                ? ShellPanelType.DevModeHub
                : ShellPanelType.None,
        );
    };

    const { config } = store.config;

    const processesHash = hash(
        store.processManager.processes.map((item) => item.id),
    );
    const viewportsHash = hash(
        store.virtualViewport.viewports.map((item) => item.id),
    );

    const layersConfig = config.properties.layers;

    return (
        <div className={classNames(style.taskBar)}>
            <div className={style.container}>
                <div className={style.controls}>
                    <ConfigCondition condition={layersConfig.appsMenu.enabled}>
                        <TaskBarItem>
                            <TaskBarAppsMenuButton
                                onClick={() =>
                                    handleShowAppsMenu(
                                        !store.panelManager.appMenuShow,
                                    )
                                }
                            />
                        </TaskBarItem>
                    </ConfigCondition>
                    <ConfigCondition
                        condition={layersConfig.viewportHub.enabled}
                    >
                        <TaskBarItem>
                            <TaskBarViewportButton
                                onClick={handleShowVirtualHub}
                            />
                        </TaskBarItem>
                    </ConfigCondition>
                </div>
                <div className={style.tasks}>
                    <TaskList
                        processes={store.processManager.processes}
                        processesHash={processesHash}
                        viewports={store.virtualViewport.viewports}
                        viewportsHash={viewportsHash}
                        currentViewport={store.virtualViewport.currentViewport}
                        onFocus={(appWindow) => handleFocusAppWindow(appWindow)}
                        onKillProcess={(appProcess) =>
                            handleKillProcess(appProcess)
                        }
                    />
                </div>

                <div className={style.actions}>
                    <ConfigCondition
                        condition={
                            config.properties.devMode.enabled &&
                            store.auth.isAdmin
                        }
                    >
                        <TaskBarItem>
                            <TaskBarDevModeButton
                                onClick={handleShowDevModeHub}
                            />
                        </TaskBarItem>
                    </ConfigCondition>
                    <ConfigCondition condition={layersConfig.audioHub.enabled}>
                        <TaskBarItem>
                            <TaskBarSoundButton
                                onClick={handleShowAudioHub}
                                volume={store.audio.volume}
                                isMuted={store.audio.isMute}
                            />
                        </TaskBarItem>
                    </ConfigCondition>
                    <TaskBarItem autoWidth>
                        <TaskBarDateTime />
                    </TaskBarItem>
                    <ConfigCondition
                        condition={layersConfig.notifications.enabled}
                    >
                        <TaskBarItem
                            showBadge={store.notification.hasNotifications}
                            badge={
                                <TaskBarBadge
                                    size="medium"
                                    severity={
                                        !store.notification
                                            .hasConfirmationNotifcations
                                            ? "info"
                                            : "attention"
                                    }
                                >
                                    <NotificationCounter
                                        count={store.notification.totalCount}
                                    />
                                </TaskBarBadge>
                            }
                        >
                            <TaskBarNotificationButton
                                status={store.notification.status}
                                hasNotifications={
                                    store.notification.status ===
                                    NotificationServiceConnectStatus.Connected
                                        ? store.notification.hasNotifications
                                        : false
                                }
                                onClick={() =>
                                    handleShowNotificationHub(
                                        !store.panelManager.notificationHubShow,
                                    )
                                }
                            />
                        </TaskBarItem>
                    </ConfigCondition>
                </div>
            </div>
        </div>
    );
});
