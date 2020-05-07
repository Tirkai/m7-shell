import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { AppsMenuItem } from "../AppsMenuItem/AppsMenuItem";
import style from "./style.module.css";
@inject("store")
@observer
export class AppsMenu extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    render() {
        return (
            <div className={style.appsMenu}>
                <div className={style.container}>
                    {this.props.store?.applicationManager.applications.map(
                        (app) => (
                            <AppsMenuItem
                                onClick={() =>
                                    this.store.applicationManager.executeApplication(
                                        app,
                                    )
                                }
                            >
                                {app.name}
                            </AppsMenuItem>
                        ),
                    )}
                </div>
            </div>
        );
    }
}
