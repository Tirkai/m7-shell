import { action, observable } from "mobx";
import { NotificationModel } from "./NotificationModel";

export class ToastNotification {
    @observable
    isShow: boolean = true;
    notification: NotificationModel;
    expireTime: number = 3000;

    constructor(notification: NotificationModel) {
        this.notification = notification;

        setTimeout(() => {
            this.setShow(false);
        }, this.expireTime);
    }

    @action
    setShow(value: boolean) {
        this.isShow = value;
    }
}
