import classNames from "classnames";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { NotificationCard } from "../NotificationCard/NotificationCard";
import style from "./style.module.css";

@inject("store")
@observer
export class NotificationToasts extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    render() {
        console.log("123");
        return (
            <div className={style.notificationToasts}>
                {this.store.notification.toasts.map((item) => (
                    <div
                        className={classNames(style.toastItem, {
                            [style.isHidden]: !item.isShow,
                        })}
                    >
                        <NotificationCard
                            {...item.notification}
                            onClose={() => item.setShow(false)}
                        />
                    </div>
                ))}
            </div>
        );
    }
}
