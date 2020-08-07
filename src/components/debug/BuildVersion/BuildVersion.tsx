import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import moment from "moment";
import React, { Component } from "react";
import style from "./style.module.css";

@inject("store")
@observer
export class BuildVersion extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    version = process.env.REACT_APP_BUILD;
    name = process.env.REACT_APP_NAME;
    render() {
        if (this.store.shell.enabledDevMode) {
            return (
                <div className={style.container}>
                    <div>{`🔑${moment
                        .utc(this.store.auth.remainingTokenTimeInSeconds * 1000)
                        .format("HH:mm:ss")}`}</div>
                    <div>{`📦${this.name}@${this.version}`}</div>
                </div>
            );
        } else return "";
    }
}
