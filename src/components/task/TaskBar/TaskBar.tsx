import classNames from "classnames";
import { ConfigCondition } from "components/config/ConfigCondition/ConfigCondition";
import { TaskBarNotificationButton } from "components/notifications/NotificationTaskbarItem/NotificationTaskbarItem";
import { NotificationServiceConnectStatus } from "enum/NotificationServiceConnectStatus";
import { ShellPanelType } from "enum/ShellPanelType";
import { useStore } from "hooks/useStore";
import { strings } from "locale";
import { observer } from "mobx-react";
import { ApplicationProcess } from "models/ApplicationProcess";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import React from "react";
import { TaskBarAppsMenuButton } from "../TaskBarAppsMenuButton/TaskBarAppsMenuButton";
import TaskBarDateTime from "../TaskBarDateTime/TaskBarDateTime";
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

    const handleShowAudioHub = () => {
        store.panelManager.setActivePanel(
            store.panelManager.activePanel !== ShellPanelType.AudioHub
                ? ShellPanelType.AudioHub
                : ShellPanelType.None,
        );
    };

    const handleKillProcess = (appProcess: ApplicationProcess) => {
        store.processManager.killProcess(appProcess);
    };

    const handleShowVirtualHub = () => {
        store.panelManager.setActivePanel(
            store.panelManager.activePanel !== ShellPanelType.Virtual
                ? ShellPanelType.Virtual
                : ShellPanelType.None,
        );
    };

    const { config } = store.config;

    return (
        <div className={classNames(style.taskBar)}>
            <div className={style.container}>
                <div className={style.controls}>
                    <ConfigCondition condition={config["appsMenu.enabled"]}>
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
                    <ConfigCondition condition={config["viewportHub.enabled"]}>
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
                        processesCount={store.processManager.processes.length}
                        viewports={store.virtualViewport.viewports}
                        viewportsCount={store.virtualViewport.viewports.length}
                        currentViewport={store.virtualViewport.currentViewport}
                        onFocus={(appWindow) => handleFocusAppWindow(appWindow)}
                        onKillProcess={(appProcess) =>
                            handleKillProcess(appProcess)
                        }
                    />
                </div>

                <div className={style.actions}>
                    <ConfigCondition condition={config["audioHub.enabled"]}>
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
                        condition={config["notifications.enabled"]}
                    >
                        <TaskBarItem
                            badge={
                                store.notification.status ===
                                NotificationServiceConnectStatus.Connected
                                    ? store.notification.totalCount > 0
                                        ? store.notification.totalCount.toString()
                                        : undefined
                                    : undefined
                            }
                        >
                            <TaskBarNotificationButton
                                status={store.notification.status}
                                exist={
                                    store.notification.status ===
                                    NotificationServiceConnectStatus.Connected
                                        ? store.notification
                                              .isExistNotifications
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
