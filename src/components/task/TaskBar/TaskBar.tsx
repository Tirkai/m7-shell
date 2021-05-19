import { SVGIcon } from "@algont/m7-ui";
import { apps, cross, virtual } from "assets/icons";
import classNames from "classnames";
import { BackdropWrapper } from "components/layout/BackdropWrapper/BackdropWrapper";
import { NotificationTaskbarItem } from "components/notifications/NotificationTaskbarItem/NotificationTaskbarItem";
import { NotificationServiceConnectStatus } from "enum/NotificationServiceConnectStatus";
import { ShellPanelType } from "enum/ShellPanelType";
import { IStore } from "interfaces/common/IStore";
import { strings } from "locale";
import { groupBy } from "lodash";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { ApplicationProcess } from "models/ApplicationProcess";
import { ContextMenuItemModel } from "models/ContextMenuItemModel";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import React, { Component } from "react";
import TaskBarDateTime from "../TaskBarDateTime/TaskBarDateTime";
import { TaskBarItem } from "../TaskBarItem/TaskBarItem";
import { TaskBarSound } from "../TaskBarSound/TaskBarSound";
import { TaskGroup } from "../TaskGroup/TaskGroup";
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
        if (appWindow instanceof ApplicationWindow) {
            if (appWindow.isCollapsed) {
                this.store.windowManager.expandWindow(appWindow);
            }
        }
    };

    handleShowNotificationHub = (value: boolean) => {
        this.store.shell.setActivePanel(
            value ? ShellPanelType.NotificationHub : ShellPanelType.None,
        );
    };

    handleShowAudioHub = () => {
        this.store.shell.setActivePanel(
            this.store.shell.activePanel !== ShellPanelType.AudioHub
                ? ShellPanelType.AudioHub
                : ShellPanelType.None,
        );
    };

    handleKillProcess = (appProcess: ApplicationProcess) => {
        this.store.processManager.killProcess(appProcess);
    };

    handleShowTileHub = () => {
        this.store.shell.setActivePanel(
            this.store.shell.activePanel !== ShellPanelType.TileHub
                ? ShellPanelType.TileHub
                : ShellPanelType.None,
        );
    };

    handleShowVirtualHub = () => {
        this.store.shell.setActivePanel(
            this.store.shell.activePanel !== ShellPanelType.Virtual
                ? ShellPanelType.Virtual
                : ShellPanelType.None,
        );
    };

    handleCloseViewportGroup = (process: ApplicationProcess) => {
        const viewport = process.window.viewport;
        this.store.processManager.processes
            .filter((item) => item.window.viewport.id === viewport.id)
            .forEach((item) => this.store.processManager.killProcess(item));
    };

    createCloseApplicationContextMenuItem = (
        appProcess: ApplicationProcess,
    ) => [
        new ContextMenuItemModel({
            icon: <SVGIcon source={cross} color="white" />,
            content: strings.application.actions.close,
            onClick: () => this.handleKillProcess(appProcess),
        }),
        // new ContextMenuItemModel({
        //     icon: cross,
        //     content: "Закрыть группу",
        //     onClick: () => this.handleCloseViewportGroup(appProcess),
        // }),
    ];

    render() {
        const groups = groupBy(
            this.store.processManager.processes,
            "window.viewport.id",
        );

        // TODO: optimize
        const groupedProcessesByViewport = Object.entries(groups).map(
            ([key, value]) => ({
                key,
                value,
            }),
        );

        return (
            <>
                <div
                    className={classNames(style.taskBar, {
                        // [style.show]: this.state.isShow,
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
                                <TaskBarItem
                                    onClick={() => this.handleShowVirtualHub()}
                                >
                                    <SVGIcon source={virtual} color="white" />
                                </TaskBarItem>

                                {groupedProcessesByViewport.map(
                                    (group, groupIndex) => (
                                        <React.Fragment key={group.key}>
                                            <TaskGroup
                                                active={
                                                    group.key ===
                                                    this.store.virtualViewport
                                                        .currentViewport.id
                                                }
                                            >
                                                {group.value.map(
                                                    (appProcess) => (
                                                        <TaskBarItem
                                                            key={appProcess.id}
                                                            hint={
                                                                <TaskHint
                                                                    title={
                                                                        appProcess.name
                                                                    }
                                                                />
                                                            }
                                                            focused={
                                                                appProcess
                                                                    .window
                                                                    .isFocused
                                                            }
                                                            onClick={() =>
                                                                this.handleFocusAppWindow(
                                                                    appProcess.window,
                                                                )
                                                            }
                                                            menu={this.createCloseApplicationContextMenuItem(
                                                                appProcess,
                                                            )}
                                                        >
                                                            <SVGIcon
                                                                source={
                                                                    appProcess
                                                                        .app
                                                                        .icon
                                                                }
                                                                color="white"
                                                            />
                                                        </TaskBarItem>
                                                    ),
                                                )}
                                            </TaskGroup>
                                        </React.Fragment>
                                    ),
                                )}
                            </div>

                            <div className={style.actions}>
                                <TaskBarItem onClick={this.handleShowAudioHub}>
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
