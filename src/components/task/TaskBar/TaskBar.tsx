import { SVGIcon } from "@algont/m7-ui";
import { apps, cross, virtual } from "assets/icons";
import classNames from "classnames";
import { NotificationTaskbarItem } from "components/notifications/NotificationTaskbarItem/NotificationTaskbarItem";
import { NotificationServiceConnectStatus } from "enum/NotificationServiceConnectStatus";
import { ShellPanelType } from "enum/ShellPanelType";
import { useStore } from "hooks/useStore";
import { strings } from "locale";
import { groupBy } from "lodash";
import { observer } from "mobx-react";
import { ApplicationProcess } from "models/ApplicationProcess";
import { ContextMenuItemModel } from "models/ContextMenuItemModel";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import React, { useMemo } from "react";
import TaskBarDateTime from "../TaskBarDateTime/TaskBarDateTime";
import { TaskBarItem } from "../TaskBarItem/TaskBarItem";
import { TaskBarSound } from "../TaskBarSound/TaskBarSound";
import { TaskGroup } from "../TaskGroup/TaskGroup";
import { TaskHint } from "../TaskHint/TaskHint";
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

    const handleShowTileHub = () => {
        store.panelManager.setActivePanel(
            store.panelManager.activePanel !== ShellPanelType.TileHub
                ? ShellPanelType.TileHub
                : ShellPanelType.None,
        );
    };

    const handleShowVirtualHub = () => {
        store.panelManager.setActivePanel(
            store.panelManager.activePanel !== ShellPanelType.Virtual
                ? ShellPanelType.Virtual
                : ShellPanelType.None,
        );
    };

    const createCloseApplicationContextMenuItem = (
        appProcess: ApplicationProcess,
    ) => [
        new ContextMenuItemModel({
            icon: <SVGIcon source={cross} color="white" />,
            content: strings.application.actions.close,
            onClick: () => handleKillProcess(appProcess),
        }),
    ];

    const tasksGroups = useMemo(() => {
        const groups = groupBy(
            store.processManager.processes,
            "window.viewport.id",
        );

        // TODO: optimize
        const groupedProcessesByViewport = Object.entries(groups).map(
            ([key, value]) => ({
                key,
                value,
            }),
        );

        const sortedGroups = groupedProcessesByViewport.sort((a, b) => {
            const firstIndex = a.value[0].window.viewport.index;
            const secondIndex = b.value[0].window.viewport.index;
            return firstIndex - secondIndex;
        });
        return sortedGroups;
    }, [store.processManager.processes.length]);

    return (
        <div className={classNames(style.taskBar)}>
            <div className={style.container}>
                <div className={style.tasks}>
                    <TaskBarItem
                        onClick={() =>
                            handleShowAppsMenu(!store.panelManager.appMenuShow)
                        }
                    >
                        <SVGIcon source={apps} color="white" />
                    </TaskBarItem>
                    <TaskBarItem onClick={() => handleShowVirtualHub()}>
                        <SVGIcon source={virtual} color="white" />
                    </TaskBarItem>

                    {tasksGroups.map((group, groupIndex) => (
                        <TaskGroup
                            key={group.key}
                            active={
                                group.key ===
                                store.virtualViewport.currentViewport.id
                            }
                        >
                            {group.value.map((appProcess) => (
                                <TaskBarItem
                                    key={appProcess.id}
                                    hint={<TaskHint title={appProcess.name} />}
                                    focused={appProcess.window.isFocused}
                                    onClick={() =>
                                        handleFocusAppWindow(appProcess.window)
                                    }
                                    menu={createCloseApplicationContextMenuItem(
                                        appProcess,
                                    )}
                                >
                                    <SVGIcon
                                        source={appProcess.app.icon}
                                        color="white"
                                    />
                                </TaskBarItem>
                            ))}
                        </TaskGroup>
                    ))}
                </div>

                <div className={style.actions}>
                    <TaskBarItem onClick={handleShowAudioHub}>
                        <TaskBarSound
                            volume={store.audio.volume}
                            isMuted={store.audio.isMute}
                        />
                    </TaskBarItem>
                    <TaskBarItem autoWidth>
                        <TaskBarDateTime />
                    </TaskBarItem>

                    <TaskBarItem
                        badge={
                            store.notification.status ===
                            NotificationServiceConnectStatus.Connected
                                ? store.notification.totalCount > 0
                                    ? store.notification.totalCount.toString()
                                    : undefined
                                : undefined
                        }
                        onClick={() =>
                            handleShowNotificationHub(
                                !store.panelManager.notificationHubShow,
                            )
                        }
                    >
                        <NotificationTaskbarItem
                            status={store.notification.status}
                            exist={
                                store.notification.status ===
                                NotificationServiceConnectStatus.Connected
                                    ? store.notification.isExistNotifications
                                    : false
                            }
                        />
                    </TaskBarItem>
                </div>
            </div>
        </div>
    );
});
