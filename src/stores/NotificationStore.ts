import { JsonRpcPayload } from "@algont/m7-utils";
import Axios from "axios";
import { AudioSource } from "constants/audio";
import {
    AUTH_TOKEN_HEADER,
    NOTIFICATIONS_WEBSOCKET_URL,
} from "constants/config";
import { NotificationServiceConnectStatus } from "enum/NotificationServiceConnectStatus";
import { ShellEvents } from "enum/ShellEvents";
import { ApplicationFactory } from "factories/ApplicationFactory";
import { NotificationFactory } from "factories/NotificationFactory";
import { IJsonRpcResponse } from "interfaces/response/IJsonRpcResponse";
import { INotificationAppRelationResponse } from "interfaces/response/INotificationAppRelationResponse";
import { INotificationCountResponse } from "interfaces/response/INotificationCountResponse";
import { INotificationResponse } from "interfaces/response/INotificationResponse";
import { makeAutoObservable } from "mobx";
import { AudioModel } from "models/AudioModel";
import { ExternalApplication } from "models/ExternalApplication";
import { NotificationGroupModel } from "models/NotificationGroupModel";
import { NotificationModel } from "models/NotificationModel";
import { ToastNotification } from "models/ToastNotification";
import io from "socket.io-client";
import {
    notificationsAppsEndpoint,
    notificationsEndpoint,
} from "utils/endpoints";
import { AppStore } from "./AppStore";

export class NotificationStore {
    socket: SocketIOClient.Socket | null = null;

    toasts: ToastNotification[] = [];

    notifications: NotificationModel[] = [];

    groups: NotificationGroupModel[] = [];

    totalCount = 0;

    applications: ExternalApplication[] = [];

    get isExistNotifications() {
        return this.groups.some((group) => group.hasNotifications);
    }

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

    setTotalCount(count: number) {
        this.totalCount = count;
    }

    setToasts(toasts: ToastNotification[]) {
        this.toasts = toasts;
    }

    async fetchGroup(group: NotificationGroupModel, login: string) {
        group.setFetching(true);

        const countResponse = await Axios.post<IJsonRpcResponse<number>>(
            notificationsEndpoint.url,
            new JsonRpcPayload("get_count_by_filter", {
                filter: {
                    login: { values: [login] },
                    app_id: { values: [group.id] },
                },
            }),
        );

        group.setCount(countResponse.data.result);

        const notificationsResponse = await Axios.post<
            IJsonRpcResponse<INotificationResponse[]>
        >(
            notificationsEndpoint.url,
            new JsonRpcPayload("get_list_by_filter", {
                filter: {
                    app_id: {
                        values: [group.id],
                    },
                    login: { values: [login] },
                },
                limit: 5,
                offset: 0,
                order: [{ field: "ntf_date", direction: "desc" }],
            }),
        );

        const notifications = notificationsResponse.data.result.map((item) =>
            NotificationFactory.createNotification(item),
        );

        group.setNotifications(notifications);

        group.setFetching(false);
    }

    async fetchTotalCount(login: string) {
        const notificationsCountResponse = await Axios.post<
            IJsonRpcResponse<number>
        >(
            notificationsEndpoint.url,
            new JsonRpcPayload("get_count_by_filter", {
                filter: {
                    login: { values: [login] },
                },
            }),
        );

        this.setTotalCount(notificationsCountResponse.data.result);
    }

    fetchNotifications(login: string) {
        try {
            this.groups.forEach((group) => {
                this.fetchGroup(group, login);
            });
        } catch (e) {
            console.error(e);
        }
    }

    async fetchApps(login: string) {
        try {
            const appsCountResponse = await Axios.post<
                IJsonRpcResponse<number>
            >(
                notificationsAppsEndpoint.url,
                new JsonRpcPayload("get_count_by_filter", {
                    filter: {
                        login: { values: [login] },
                    },
                }),
            );

            const appsListResponse = await Axios.post<
                IJsonRpcResponse<INotificationAppRelationResponse[]>
            >(
                notificationsAppsEndpoint.url,
                new JsonRpcPayload("get_list_by_filter", {
                    filter: {},
                    order: [
                        {
                            field: "app_name",
                            direction: "asc",
                        },
                    ],
                    limit: appsCountResponse.data.result,
                    offset: 0,
                }),
            );

            this.setApplications(
                appsListResponse.data.result.map((item) =>
                    ApplicationFactory.createNotificationAppRelation(item),
                ),
            );

            this.setGroups(
                this.applications.map(
                    (app) =>
                        new NotificationGroupModel({
                            id: app.id,
                            name: app.name,
                            icon: app.icon,
                            count: 0,
                            notifications: [],
                        }),
                ),
            );
        } catch (e) {
            console.error(e);
        }
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
                resolve(true);
            } catch (e) {
                console.error(e);
                reject();
            }
        });
    }

    connectToNotificationsSocket(token: string) {
        try {
            if (token.length > 0) {
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

                    this.socket.on(
                        "delete_notification",
                        (response: INotificationResponse) => {
                            const notificationId = response.ntf_id;

                            const group = this.groups.find((groupItem) =>
                                groupItem.notifications.find(
                                    (notifyItem) =>
                                        notifyItem.id === notificationId,
                                ),
                            );

                            if (group) {
                                this.fetchGroup(
                                    group,
                                    this.store.auth.userLogin,
                                );
                            }
                        },
                    );

                    this.socket.on("disconnect", () => {
                        this.setStatus(
                            NotificationServiceConnectStatus.Disconnected,
                        );
                    });

                    this.socket.on("reconnect_error", () => {
                        this.reconnectToNotificationSocket();
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
            /* TODO: Check unauthorize exception */

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

            const group = this.groups.find(
                (item) => item.id === notification.applicationId,
            );
            if (group) {
                this.fetchGroup(group, this.store.auth.userLogin);
            }

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
        this.totalCount = count;
    }

    setApplications(apps: ExternalApplication[]) {
        this.applications = apps;
    }

    setGroups(groups: NotificationGroupModel[]) {
        this.groups = groups;
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
        } catch (e) {
            console.error(e);
        }
    }
}
