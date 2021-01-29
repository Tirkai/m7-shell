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

    version = process.env.REACT_APP_VERSION;
    author = process.env.REACT_APP_AUTHOR;
    commit = process.env.REACT_APP_COMMIT;
    date = process.env.REACT_APP_DATE;
    email = process.env.REACT_APP_EMAIL;
    branch = process.env.REACT_APP_BRANCH;

    render() {
        if (this.store.shell.enabledDevMode) {
            return (
                <div className={style.container}>
                    <div>{`🔑${moment
                        .utc(this.store.auth.remainingTokenTimeInSeconds * 1000)
                        .format("HH:mm:ss")}`}</div>
                    <div>{`📦m7-shell@${this.version} [${this.branch}]`}</div>
                    <div>{`${this.author} [${this.email}]`}</div>
                    <div>{`${moment(this.date).format(
                        "DD.MM.YYYY HH.mm:ss",
                    )} [${this.commit}]`}</div>
                </div>
            );
        } else return "";
    }
}
