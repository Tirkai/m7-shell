import { makeAutoObservable } from "mobx";
import { NotificationModel } from "./NotificationModel";

interface INotificationGroupModelOptions {
    id: string;
    notifications: NotificationModel[];
    count: number;
    name: string;
    icon: string;
}

export class NotificationGroupModel {
    id: string;
    notifications: NotificationModel[];
    name: string;
    icon: string;
    count: number;
    isFetching: boolean = false;
    constructor(options: INotificationGroupModelOptions) {
        makeAutoObservable(this);
        this.id = options.id;
        this.notifications = options.notifications;
        this.count = options.count;
        this.name = options.name;
        this.icon = options.icon;
    }

    get hasNotifications() {
        return this.notifications.length > 0;
    }

    setNotifications(notifications: NotificationModel[]) {
        this.notifications = notifications.slice(-5);
    }

    setCount(count: number) {
        this.count = count;
    }

    setName(name: string) {
        this.name = name;
    }

    setIcon(icon: string) {
        this.icon = icon;
    }

    setFetching(value: boolean) {
        this.isFetching = value;
    }

    clearNotifications() {
        this.notifications = [];
    }
}
