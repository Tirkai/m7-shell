import Axios from "axios";
import {
    AUTH_TOKEN_HEADER,
    NOTIFICATIONS_WEBSOCKET_URL,
} from "constants/config";
import { NotificationFactory } from "factories/NotificationFactory";
import { IJsonRpcResponse } from "interfaces/response/IJsonRpcResponse";
import { INotificationCountResponse } from "interfaces/response/INotificationCountResponse";
import { INotificationResponse } from "interfaces/response/INotificationResponse";
import { flatten } from "lodash";
import { action, observable } from "mobx";
import { NotificationModel } from "models/NotificationModel";
import { ToastNotification } from "models/ToastNotification";
import io from "socket.io-client";
import {
    legacyNotificationEndpoint,
    notificationsEndpoint,
} from "utils/endpoints";
import { JsonRpcPayload } from "utils/JsonRpcPayload";
import { AppStore } from "./AppStore";

const title = `Сообщение о событии`;

export class NotificationStore {
    socket: SocketIOClient.Socket | null = null;

    @observable
    toasts: ToastNotification[] = [];

    @observable
    isConnected: boolean = false;

    @observable
    notifications: NotificationModel[] = [];

    @observable
    count = 0;

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;
    }

    async fetchNotifications(login: string) {
        return new Promise(async (resolve) => {
            const appsResponse = await Axios.post<IJsonRpcResponse<string[]>>(
                legacyNotificationEndpoint.url,
                new JsonRpcPayload("getAppIds"),
            );

            const countResponse = await Axios.post<IJsonRpcResponse<number>>(
                notificationsEndpoint.url,
                new JsonRpcPayload("get_count_by_filter", {
                    filter: {
                        login: { values: [login] },
                    },
                }),
            );

            this.count = countResponse.data.result;

            const servicedApplicationsIds = appsResponse.data.result;

            const notifications = servicedApplicationsIds.map(async (id) => {
                const response = await Axios.post<
                    IJsonRpcResponse<INotificationResponse[]>
                >(
                    notificationsEndpoint.url,
                    new JsonRpcPayload("get_list_by_filter", {
                        filter: {
                            app_id: {
                                values: [id],
                            },
                            login: { values: [login] },
                        },
                        limit: 5,
                        offset: 0,
                        order: [{ field: "ntf_date", direction: "desc" }],
                    }),
                );
                return response.data.result.map((item) =>
                    NotificationFactory.createNotification(item),
                );
            });

            Promise.all(notifications).then((values) => {
                const notificationsList = values.filter((item) => item.length);
                this.notifications = flatten(notificationsList);
            });

            resolve();
        });
    }

    removeToast(toast: ToastNotification) {
        this.toasts.splice(this.toasts.indexOf(toast), 1);
    }

    async connectToNotificationsSocket(token: string) {
        await this.fetchNotifications(this.store.auth.userLogin);
        if (this.socket === null) {
            this.socket = io.connect(NOTIFICATIONS_WEBSOCKET_URL, {
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            [AUTH_TOKEN_HEADER]: token,
                        },
                    },
                },
            });

            this.socket.on(
                "add_notification",
                (response: INotificationResponse) =>
                    this.addNotification(response),
            );

            this.socket.on(
                "notification_count",
                (response: INotificationCountResponse) =>
                    this.updateNotificationCount(response.total),
            );

            this.socket.on("disconnect", () => {
                this.socket?.close();
                this.connectToNotificationsSocket(this.store.auth.accessToken);
            });
        }
    }

    @action
    addNotification(notificationData: INotificationResponse) {
        const notification = NotificationFactory.createNotification(
            notificationData,
        );

        const toast = new ToastNotification(notification);

        this.toasts.unshift(new ToastNotification(notification));

        this.notifications.unshift(notification);
    }

    @action
    updateNotificationCount(count: number) {
        this.count = count;
    }

    @action
    async removeNotifications(
        notifications: NotificationModel[],
        login: string,
    ) {
        const response = await Axios.post<IJsonRpcResponse>(
            notificationsEndpoint.url,
            new JsonRpcPayload("drop_user_notifications", {
                user_notifications: notifications.map((item) => ({
                    ntf_id: item.id,
                    login,
                })),
            }),
        );
        this.fetchNotifications(this.store.auth.userLogin);
    }
}
