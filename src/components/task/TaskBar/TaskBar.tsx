import { SVGIcon } from "@algont/m7-ui";
import { apps } from "assets/icons";
import { DropdownMenuItem } from "components/controls/DropdownMenuItem/DropdownMenuItem";
import { NotificationTaskbarItem } from "components/notifications/NotificationTaskbarItem/NotificationTaskbarItem";
import { NotificationServiceConnectStatus } from "enum/NotificationServiceConnectStatus";
import { ShellPanelType } from "enum/ShellPanelType";
import { IStore } from "interfaces/common/IStore";
import { strings } from "locale";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { Application } from "models/Application";
import { ApplicationWindow } from "models/ApplicationWindow";
import React, { Component } from "react";
import TaskBarDateTime from "../TaskBarDateTime/TaskBarDateTime";
import { TaskBarItem } from "../TaskBarItem/TaskBarItem";
import { TaskBarSound } from "../TaskBarSound/TaskBarSound";
import style from "./style.module.css";

@inject("store")
@observer
export class TaskBar extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    handleShowAppsMenu = (value: boolean) => {
        if (this.store.applicationManager.applications.length) {
            this.store.shell.setActivePanel(
                value ? ShellPanelType.StartMenu : ShellPanelType.None,
            );
        } else {
            this.store.message.showMessage(
                strings.error.noAvailableApplications,
                strings.error.failedGetAvailableApplications,
            );
        }
    };

    handleExecuteApp = (app: Application) => {
        this.store.shell.setActivePanel(ShellPanelType.None);

        this.store.applicationManager.executeApplication(app);
    };

    handleFocusAppWindow = (appWindow: ApplicationWindow) => {
        this.store.windowManager.focusWindow(appWindow);
        if (appWindow.isCollapsed) {
            this.store.windowManager.expandWindow(appWindow);
        }
    };

    handleShowNotificationHub = (value: boolean) => {
        this.store.shell.setActivePanel(
            value ? ShellPanelType.NotificationHub : ShellPanelType.None,
        );
    };

    handleShowAudioHub = (value: boolean) => {
        this.store.shell.setActivePanel(
            value ? ShellPanelType.AudioHub : ShellPanelType.None,
        );
    };

    handleCloseWindow = (appWindow: ApplicationWindow) => {
        this.store.windowManager.closeWindow(appWindow);
    };

    render() {
        return (
            <>
                <div className={style.taskBar}>
                    <div className={style.container}>
                        <div className={style.tasks}>
                            <TaskBarItem
                                onClick={() =>
                                    this.handleShowAppsMenu(
                                        !this.props.store?.shell.appMenuShow,
                                    )
                                }
                            >
                                <SVGIcon source={apps} color="white" />
                            </TaskBarItem>
                            {this.store.windowManager.windows.map(
                                (appWindow) => (
                                    <TaskBarItem
                                        key={appWindow.id}
                                        executed
                                        focused={appWindow.isFocused}
                                        onClick={() =>
                                            this.handleFocusAppWindow(appWindow)
                                        }
                                        menu={[
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    this.handleCloseWindow(
                                                        appWindow,
                                                    )
                                                }
                                            >
                                                Закрыть
                                            </DropdownMenuItem>,
                                        ]}
                                    >
                                        <SVGIcon
                                            source={appWindow.application.icon}
                                            color="white"
                                        />
                                    </TaskBarItem>
                                ),
                            )}
                        </div>
                        <div className={style.actions}>
                            <TaskBarItem onClick={() => true} autoWidth>
                                <TaskBarDateTime />
                            </TaskBarItem>
                            <TaskBarItem
                                onClick={() =>
                                    this.handleShowAudioHub(
                                        !this.store.shell.audioHubShow,
                                    )
                                }
                            >
                                <TaskBarSound
                                    isMuted={this.store.audio.isMute}
                                />
                            </TaskBarItem>
                            <TaskBarItem
                                badge={
                                    this.store.notification.status ===
                                    NotificationServiceConnectStatus.Connected
                                        ? this.store.notification.count > 0
                                            ? this.store.notification.count.toString()
                                            : undefined
                                        : undefined
                                }
                                onClick={() =>
                                    this.handleShowNotificationHub(
                                        !this.store.shell.notificationHubShow,
                                    )
                                }
                            >
                                <NotificationTaskbarItem
                                    status={this.store.notification.status}
                                    exist={
                                        this.store.notification.status ===
                                        NotificationServiceConnectStatus.Connected
                                            ? this.store.notification
                                                  .notifications.length > 0
                                            : false
                                    }
                                />
                            </TaskBarItem>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
