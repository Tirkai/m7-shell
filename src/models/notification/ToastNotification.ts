import { makeAutoObservable } from "mobx";
import { NotificationExpireTime } from "./NotificationExpireTime";
import { NotificationModel } from "./NotificationModel";

interface IToastNotificationOptions {
    notification: NotificationModel;
    expireTime: NotificationExpireTime;
}

export class ToastNotification {
    isShow: boolean = true;
    notification: NotificationModel;
    expireTime: number;

    constructor(options: IToastNotificationOptions) {
        this.notification = options.notification;
        this.expireTime = options.expireTime;

        makeAutoObservable(this);

        setTimeout(() => {
            this.setShow(false);
        }, this.expireTime);
    }

    setShow(value: boolean) {
        this.isShow = value;
    }
}
