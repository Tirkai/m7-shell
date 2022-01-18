import { makeAutoObservable } from "mobx";
import { NotificationExpireTime } from "./NotificationExpireTime";
import { NotificationModel } from "./NotificationModel";

interface IToastNotificationOptions {
    notification: NotificationModel;
    expireTime?: NotificationExpireTime;
}

export class ToastNotification {
    isShow: boolean = true;
    notification: NotificationModel;
    expireTime?: number;

    constructor(options: IToastNotificationOptions) {
        this.notification = options.notification;
        if (options.expireTime) {
            this.expireTime = options.expireTime;
            setTimeout(() => {
                this.setShow(false);
            }, this.expireTime);
        }

        makeAutoObservable(this);
    }

    setShow(value: boolean) {
        this.isShow = value;
    }
}
