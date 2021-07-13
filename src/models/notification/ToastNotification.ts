import { makeAutoObservable } from "mobx";
import { NotificationModel } from "./NotificationModel";

export class ToastNotification {
    isShow: boolean = true;
    notification: NotificationModel;
    expireTime: number = 3000;

    constructor(notification: NotificationModel) {
        this.notification = notification;

        makeAutoObservable(this);

        setTimeout(() => {
            this.setShow(false);
        }, this.expireTime);
    }

    setShow(value: boolean) {
        this.isShow = value;
    }
}
