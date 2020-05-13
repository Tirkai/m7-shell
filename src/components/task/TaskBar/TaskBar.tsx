import { apps, notificationsNone } from "assets/icons";
import { BlurBackground } from "components/layout/BlurBackground/BlurBackground";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { Application } from "models/Application";
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
                                    <img src={apps} />
                                </TaskBarItem>
                                {this.props.store?.windowManager.windows.map(
                                    (appWindow) => (
                                        <TaskBarItem
                                            executed
                                            onClick={() => {}}
                                        >
                                            <img
                                                src={appWindow.application.icon}
                                            />
                                        </TaskBarItem>
                                    ),
                                )}
                            </div>
                            <div className={style.actions}>
                                <TaskBarItem onClick={() => {}} autoWidth>
                                    <TaskBarDateTime />
                                </TaskBarItem>
                                <TaskBarItem onClick={() => {}}>
                                    <img src={notificationsNone} />
                                </TaskBarItem>
                            </div>
                        </div>
                    </BlurBackground>
                </div>
            </>
        );
    }
}
