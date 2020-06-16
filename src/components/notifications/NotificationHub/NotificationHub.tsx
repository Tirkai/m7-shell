import classNames from "classnames";
import { BlurBackground } from "components/layout/BlurBackground/BlurBackground";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import style from "./style.module.css";

@inject("store")
@observer
export class NotificationHub extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!.shell;
    }

    render() {
        return (
            <div
                className={classNames(style.notificationHub, {
                    [style.show]: this.store.notificationHubShow,
                })}
            >
                <BlurBackground>
                    <div className={style.container}>
                        <div className={style.content}>
                            <div className={style.title}>Уведомления</div>
                            <div className={style.notificationsList}>
                                <div className={style.notificationItem}>
                                    Нет уведомлений
                                </div>
                            </div>
                        </div>
                    </div>
                </BlurBackground>
            </div>
        );
    }
}
