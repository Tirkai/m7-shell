import { apps, videocam } from "assets/icons";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { AppsMenu } from "../AppsMenu/AppsMenu";
import { TaskBarItem } from "../TaskBarItem/TaskBarItem";
import style from "./style.module.css";

@inject("store")
@observer
export class TaskBar extends Component<IStore> {
    @computed
    get store() {
        return this.props.store;
    }

    render() {
        return (
            <div className={style.taskBar}>
                <AppsMenu />
                <TaskBarItem>
                    <img src={apps} />
                </TaskBarItem>
                {this.props.store?.windowManager.windows.map((appWindow) => (
                    <TaskBarItem executed>
                        <img src={videocam} />
                    </TaskBarItem>
                ))}
            </div>
        );
    }
}
