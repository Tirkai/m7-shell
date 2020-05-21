import { apps, notificationsNone } from "assets/icons";
import { BlurBackground } from "components/layout/BlurBackground/BlurBackground";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { Application } from "models/Application";
import { ApplicationWindow } from "models/ApplicationWindow";
import React, { Component } from "react";
import { AppsMenu } from "../AppsMenu/AppsMenu";
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
        this.store.shell.setAppMenuShow(value);
    };

    handleExecuteApp = (app: Application) => {
        this.store.shell.setAppMenuShow(false);
        this.store.applicationManager.executeApplication(app);
    };

    handleFocusAppWindow = (appWindow: ApplicationWindow) => {
        this.store.windowManager.focusWindow(appWindow);
    };

    render() {
        return (
            <>
                <AppsMenu
                    applications={this.store.applicationManager.applications}
                    isShow={this.store.shell.appMenuShow}
                    onExecuteApp={this.handleExecuteApp}
                />

                <div className={style.taskBar}>
                    <BlurBackground>
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
                                    <img src={apps} alt="Applications" />
                                </TaskBarItem>
                                {this.props.store?.windowManager.windows.map(
                                    (appWindow) => (
                                        <TaskBarItem
                                            executed
                                            focused={appWindow.isFocused}
                                            onClick={() =>
                                                this.handleFocusAppWindow(
                                                    appWindow,
                                                )
                                            }
                                        >
                                            <img
                                                src={appWindow.application.icon}
                                                alt="App Icon"
                                            />
                                        </TaskBarItem>
                                    ),
                                )}
                            </div>
                            <div className={style.actions}>
                                <TaskBarItem onClick={() => true} autoWidth>
                                    <TaskBarDateTime />
                                </TaskBarItem>
                                <TaskBarItem onClick={() => true}>
                                    <img
                                        src={notificationsNone}
                                        alt="Notifications"
                                    />
                                </TaskBarItem>
                            </div>
                        </div>
                    </BlurBackground>
                </div>
            </>
        );
    }
}
