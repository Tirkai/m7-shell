import { SVGIcon } from "@algont/m7-ui";
import { apps, cross, layout } from "assets/icons";
import classNames from "classnames";
import { BackdropWrapper } from "components/layout/BackdropWrapper/BackdropWrapper";
import { NotificationTaskbarItem } from "components/notifications/NotificationTaskbarItem/NotificationTaskbarItem";
import { NotificationServiceConnectStatus } from "enum/NotificationServiceConnectStatus";
import { ShellPanelType } from "enum/ShellPanelType";
import { IStore } from "interfaces/common/IStore";
import { strings } from "locale";
import { computed, reaction } from "mobx";
import { inject, observer } from "mobx-react";
import { ApplicationProcess } from "models/ApplicationProcess";
import { ApplicationWindow } from "models/ApplicationWindow";
import { ContextMenuItemModel } from "models/ContextMenuItemModel";
import React, { Component } from "react";
import TaskBarDateTime from "../TaskBarDateTime/TaskBarDateTime";
import { TaskBarItem } from "../TaskBarItem/TaskBarItem";
import { TaskBarSound } from "../TaskBarSound/TaskBarSound";
import { TaskHint } from "../TaskHint/TaskHint";
import style from "./style.module.css";

@inject("store")
@observer
export class TaskBar extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    state = {
        isShow: false,
    };

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

    handleKillProcess = (appProcess: ApplicationProcess) => {
        this.store.processManager.killProcess(appProcess);
    };

    handleShowNetworkTroubleMessage = () => {
        this.store.message.showMessage("[ph] Network trouble", "[ph]");
    };

    handleShowDesktopLayoutConfig = () => {
        this.store.desktop.setEditMode(!this.store.desktop.isEditMode);
    };

    componentDidMount() {
        this.setState({
            isShow: this.store.shell.displayMode.taskbarVisible,
        });

        reaction(
            () => this.store.shell.displayMode,
            () => {
                this.setState({
                    isShow: this.store.shell.displayMode.taskbarVisible,
                });
            },
        );
    }

    createCloseApplicationContextMenuItem = (appProcess: ApplicationProcess) =>
        new ContextMenuItemModel({
            icon: cross,
            content: strings.application.actions.close,
            onClick: () => this.handleKillProcess(appProcess),
        });

    render() {
        return (
            <>
                <div
                    className={classNames(style.taskBar, {
                        [style.show]: this.state.isShow,
                    })}
                >
                    <BackdropWrapper active>
                        <div className={style.container}>
                            <div className={style.tasks}>
                                <TaskBarItem
                                    onClick={() =>
                                        this.handleShowAppsMenu(
                                            !this.props.store?.shell
                                                .appMenuShow,
                                        )
                                    }
                                >
                                    <SVGIcon source={apps} color="white" />
                                </TaskBarItem>
                                {this.store.processManager.processes.map(
                                    (appProcess) => (
                                        <TaskBarItem
                                            key={appProcess.id}
                                            executed
                                            hint={
                                                <TaskHint
                                                    title={appProcess.name}
                                                />
                                            }
                                            focused={
                                                appProcess.window.isFocused
                                            }
                                            onClick={() =>
                                                this.handleFocusAppWindow(
                                                    appProcess.window,
                                                )
                                            }
                                            menu={[
                                                this.createCloseApplicationContextMenuItem(
                                                    appProcess,
                                                ),
                                            ]}
                                        >
                                            <SVGIcon
                                                source={appProcess.app.icon}
                                                color="white"
                                            />
                                        </TaskBarItem>
                                    ),
                                )}
                            </div>

                            <div className={style.actions}>
                                {/* TODO: Locale */}
                                <TaskBarItem
                                    onClick={() =>
                                        this.handleShowDesktopLayoutConfig()
                                    }
                                >
                                    <SVGIcon source={layout} color="white" />
                                </TaskBarItem>
                                <TaskBarItem
                                    onClick={() =>
                                        this.handleShowAudioHub(
                                            !this.store.shell.audioHubShow,
                                        )
                                    }
                                >
                                    <TaskBarSound
                                        volume={this.store.audio.volume}
                                        isMuted={this.store.audio.isMute}
                                    />
                                </TaskBarItem>
                                <TaskBarItem autoWidth>
                                    <TaskBarDateTime />
                                </TaskBarItem>

                                <TaskBarItem
                                    badge={
                                        this.store.notification.status ===
                                        NotificationServiceConnectStatus.Connected
                                            ? this.store.notification
                                                  .totalCount > 0
                                                ? this.store.notification.totalCount.toString()
                                                : undefined
                                            : undefined
                                    }
                                    onClick={() =>
                                        this.handleShowNotificationHub(
                                            !this.store.shell
                                                .notificationHubShow,
                                        )
                                    }
                                >
                                    <NotificationTaskbarItem
                                        status={this.store.notification.status}
                                        exist={
                                            this.store.notification.status ===
                                            NotificationServiceConnectStatus.Connected
                                                ? this.store.notification
                                                      .isExistNotifications
                                                : false
                                        }
                                    />
                                </TaskBarItem>
                            </div>
                        </div>
                    </BackdropWrapper>
                </div>
            </>
        );
    }
}
