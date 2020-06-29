import { INotificationResponse } from "interfaces/response/INotificationResponse";
import { action, computed, observable } from "mobx";
import { NotificationModel } from "models/NotificationModel";
import io from "socket.io-client";
import { v4 } from "uuid";

const text = `
    Текст который что-то описывает, а может быть и не описывает.
    Необходим тут, чтобы занять объем
`;

const title = `Сообщение о событии`;

export class NotificationStore {
    socket: SocketIOClient.Socket | null = null;

    isConnected: boolean = false;

    @observable
    notifications: NotificationModel[] = [];

    @computed
    get count() {
        return this.notifications.length;
    }

    constructor() {
        this.notifications.push(
            new NotificationModel({
                id: v4(),
                applicationId: "73pxZKbkgFYmfTps9fR7Ck",
                text,
                title,
                url: "http://localhost/",
            }),
            new NotificationModel({
                id: v4(),
                applicationId: "73pxZKbkgFYmfTps9fR7Ck",
                text,
                title,
                url: "http://localhost/",
            }),
            new NotificationModel({
                id: v4(),
                applicationId: "iX4nJN0VKUO9SSQ6fxsKQ",
                text,
                title,
                url: "http://localhost/",
            }),
            new NotificationModel({
                id: v4(),
                applicationId: "iX4nJN0VKUO9SSQ6fxsKQ",
                text,
                title,
                url: "http://localhost/",
            }),
            new NotificationModel({
                id: v4(),
                applicationId: "iX4nJN0VKUO9SSQ6fxsKQ",
                text,
                title,
                url: "http://localhost/",
            }),
            new NotificationModel({
                id: v4(),
                applicationId: "iX4nJN0VKUO9SSQ6fxsKQ",
                text,
                title,
                url: "http://localhost/",
            }),
        );
    }

    connectToNotificationsSocket() {
        this.socket = io("http://localhost");

        this.socket.on("connect", () => (this.isConnected = true));

        this.socket.on("disconnect", () => (this.isConnected = false));

        this.socket.on("notification", (notification: INotificationResponse) =>
            this.addNotification(notification),
        );

        this.socket.on("notificationCount", this.updateNotificationCount);
    }

    @action
    addNotification(notification: INotificationResponse) {
        alert("addNotification");
    }

    @action
    updateNotificationCount() {
        alert("updateNotificationCount");
    }

    @action
    removeNotifications(notifications: NotificationModel[]) {
        notifications.forEach((item) => {
            this.notifications.splice(this.notifications.indexOf(item), 1);
        });
    }
}
