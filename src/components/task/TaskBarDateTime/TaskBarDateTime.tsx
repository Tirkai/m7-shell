import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import style from "./style.module.css";
@inject("store")
@observer
export class TaskBarDateTime extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    render() {
        return (
            <div className={style.taskBarDateTime}>
                <div className={style.time}>
                    {this.store.dateTime.computedTime}
                </div>
                <div className={style.date}>
                    {this.store.dateTime.computedDate}
                </div>
            </div>
        );
    }
}

export default TaskBarDateTime;
