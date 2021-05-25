import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import style from "./style.module.css";

@inject("store")
@observer
export class BuildVersion extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    render() {
        if (this.store.shell.enabledDevMode) {
            return <div className={style.container}></div>;
        } else return "";
    }
}
