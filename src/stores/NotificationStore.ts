import { JsonRpcPayload } from "@algont/m7-utils";
import Axios from "axios";
import { AudioSource } from "constants/audio";
import {
    AUTH_TOKEN_HEADER,
    NOTIFICATIONS_WEBSOCKET_URL,
} from "constants/config";
import { NotificationServiceConnectStatus } from "enum/NotificationServiceConnectStatus";
import { ShellEvents } from "enum/ShellEvents";
import { NotificationFactory } from "factories/NotificationFactory";
import { IJsonRpcResponse } from "interfaces/response/IJsonRpcResponse";
import { INotificationCountResponse } from "interfaces/response/INotificationCountResponse";
import { INotificationResponse } from "interfaces/response/INotificationResponse";
import { flatten } from "lodash";
import { makeAutoObservable } from "mobx";
import { AudioModel } from "models/AudioModel";
import { NotificationModel } from "models/NotificationModel";
import { ToastNotification } from "models/ToastNotification";
import io from "socket.io-client";
import {
    legacyNotificationEndpoint,
    notificationsEndpoint,
} from "utils/endpoints";
import { AppStore } from "./AppStore";

export class NotificationStore {
    socket: SocketIOClient.Socket | null = null;

    toasts: ToastNotification[] = [];

    notifications: NotificationModel[] = [];

    count = 0;

    status: NotificationServiceConnectStatus =
        NotificationServiceConnectStatus.Default;

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);
    }

    setStatus(status: NotificationServiceConnectStatus) {
        this.status = status;
    }

    setNotifications(notifications: NotificationModel[]) {
        this.notifications = notifications;
    }

    setCount(count: number) {
        this.count = count;
    }

    setToasts(toasts: ToastNotification[]) {
        this.toasts = toasts;
    }

    async fetchNotifications(login: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const appsResponse = await Axios.post<
                    IJsonRpcResponse<string[]>
                >(
                    legacyNotificationEndpoint.url,
                    new JsonRpcPayload("getAppIds"),
                );

                const countResponse = await Axios.post<
                    IJsonRpcResponse<number>
                >(
                    notificationsEndpoint.url,
                    new JsonRpcPayload("get_count_by_filter", {
                        filter: {
                            login: { values: [login] },
                        },
                    }),
                );

                this.setCount(countResponse.data.result);

                const servicedApplicationsIds = appsResponse.data.result;

                const notifications = servicedApplicationsIds.map(
                    async (id) => {
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
                                order: [
                                    { field: "ntf_date", direction: "desc" },
                                ],
                            }),
                        );
                        return response.data.result.map((item) =>
                            NotificationFactory.createNotification(item),
                        );
                    },
                );

                Promise.all(notifications)
                    .then((values) => {
                        const notificationsList = values.filter(
                            (item) => item?.length,
                        );
                        this.setNotifications(flatten(notificationsList ?? []));
                    })
                    .catch((e) => console.error(e));

                resolve();
            } catch (e) {
                reject();
            }
        });
    }

    removeToast(toast: ToastNotification) {
        this.toasts.splice(this.toasts.indexOf(toast), 1);
    }

    async reconnectToNotificationSocket() {
        console.warn("Trying reconnect notification socket", {
            token: this.store.auth.accessToken,
        });

        await this.disconnectFromNotificationsSocket();
        this.connectToNotificationsSocket(this.store.auth.accessToken);
    }

    async disconnectFromNotificationsSocket() {
        return new Promise((resolve, reject) => {
            try {
                this.socket?.close();
                this.socket = null;
                resolve();
            } catch (e) {
                console.error(e);
                reject();
            }
        });
    }

    async connectToNotificationsSocket(token: string) {
        try {
            if (token.length > 0) {
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

                    this.socket.on("connect", () => {
                        this.setStatus(
                            NotificationServiceConnectStatus.Connected,
                        );
                    });

                    this.socket.on(
                        "add_notification",
                        (response: INotificationResponse) =>
                            this.addNotification(
                                NotificationFactory.createNotification(
                                    response,
                                ),
                            ),
                    );

                    this.socket.on(
                        "notification_count",
                        (response: INotificationCountResponse) =>
                            this.updateNotificationCount(response.total),
                    );

                    this.socket.on("disconnect", () => {
                        this.setStatus(
                            NotificationServiceConnectStatus.Disconnected,
                        );

                        // this.reconnectToNotificationSocket();
                    });

                    window.addEventListener(
                        ShellEvents.Logout,
                        () => {
                            this.disconnectFromNotificationsSocket();
                        },
                        {
                            once: true,
                        },
                    );
                }
            } else {
                console.warn(
                    "Empty token when auth into the notification service",
                );
            }
        } catch (e) {
            console.error(e);
            this.setStatus(NotificationServiceConnectStatus.Disconnected);
            if (this.store.auth.isAuthorized) {
                setTimeout(
                    async () => this.reconnectToNotificationSocket(),
                    3000,
                );
            }
        }
    }

    addNotification(notification: NotificationModel) {
        try {
            this.toasts.unshift(new ToastNotification(notification));
            this.notifications.unshift(notification);
            this.store.audio.playAudio(
                new AudioModel({
                    source: AudioSource.Notification,
                    awaitQueue: false,
                }),
            );
        } catch (e) {
            console.error(e);
        }
    }

    updateNotificationCount(count: number) {
        this.count = count;
    }

    async removeNotifications(
        notifications: NotificationModel[],
        login: string,
    ) {
        try {
            await Axios.post<IJsonRpcResponse>(
                notificationsEndpoint.url,
                new JsonRpcPayload("drop_user_notifications", {
                    user_notifications: notifications.map((item) => ({
                        ntf_id: item.id,
                        login,
                    })),
                }),
            );
            this.fetchNotifications(this.store.auth.userLogin);
        } catch (e) {
            console.error(e);
        }
    }
}
