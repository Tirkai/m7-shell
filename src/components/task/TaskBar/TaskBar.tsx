import { SVGIcon } from "@algont/m7-ui";
import { apps, notifications, notificationsNone } from "assets/icons";
import { DropdownMenuItem } from "components/controls/DropdownMenuItem/DropdownMenuItem";
import { ShellPanelType } from "enum/ShellPanelType";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { Application } from "models/Application";
import { ApplicationWindow } from "models/ApplicationWindow";
import React, { Component } from "react";
import TaskBarDateTime from "../TaskBarDateTime/TaskBarDateTime";
import { TaskBarItem } from "../TaskBarItem/TaskBarItem";
import style from "./style.module.css";

@inject("store")
@observer
export class TaskBar extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    handleShowAppsMenu = (value: boolean) => {
        this.store.shell.setActivePanel(
            value ? ShellPanelType.StartMenu : ShellPanelType.None,
        );
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
                                badge={
                                    this.store.notification.count > 0
                                        ? this.store.notification.count.toString()
                                        : undefined
                                }
                                onClick={() =>
                                    this.handleShowNotificationHub(
                                        !this.store.shell.notificationHubShow,
                                    )
                                }
                            >
                                {this.store.notification.count > 0 ? (
                                    <SVGIcon
                                        key={"notificationsExist"}
                                        source={notifications}
                                        color="white"
                                    />
                                ) : (
                                    <SVGIcon
                                        key="notificationsNotExist"
                                        source={notificationsNone}
                                        color="white"
                                    />
                                )}
                            </TaskBarItem>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
