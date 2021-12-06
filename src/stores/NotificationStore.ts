import {
    IJsonRpcResponse,
    JsonRpcFailure,
    JsonRpcPayload,
    JsonRpcResult,
    RequestListPayload,
} from "@algont/m7-utils";
import Axios, { AxiosResponse } from "axios";
import {
    AUTH_TOKEN_HEADER,
    NOTIFICATIONS_WEBSOCKET_URL,
} from "constants/config";
import { ApplicationFactory } from "factories/ApplicationFactory";
import { NotificationFactory } from "factories/NotificationFactory";
import { INotificationAppRelationResponse } from "interfaces/response/INotificationAppRelationResponse";
import { INotificationCountResponse } from "interfaces/response/INotificationCountResponse";
import { INotificationResponse } from "interfaces/response/INotificationResponse";
import { makeAutoObservable } from "mobx";
import { ExternalApplication } from "models/app/ExternalApplication";
import { NotificationExpireTime } from "models/notification/NotificationExpireTime";
import { NotificationGroupModel } from "models/notification/NotificationGroupModel";
import { NotificationModel } from "models/notification/NotificationModel";
import { NotificationServiceConnectStatus } from "models/notification/NotificationServiceConnectStatus";
import { NotificationTab } from "models/notification/NotificationTab";
import { ToastNotification } from "models/notification/ToastNotification";
import { ShellEvents } from "models/panel/ShellEvents";
import io from "socket.io-client";
import {
    notificationsAppsEndpoint,
    notificationsEndpoint,
} from "utils/endpoints";
import { AppStore } from "./AppStore";

export class NotificationStore {
    socket: any | null = null;

    toasts: ToastNotification[] = [];

    isShowInstruction: boolean = false;

    instructionText: string = "";

    // notifications: NotificationModel[] = [];

    groups: NotificationGroupModel[] = [];

    importantNotifications: NotificationModel[] = [];

    totalCount = 0;

    applications: ExternalApplication[] = [];

    get isExistNotifications() {
        return this.groups.some((group) => group.hasNotifications);
    }

    status: NotificationServiceConnectStatus =
        NotificationServiceConnectStatus.Default;

    tab: NotificationTab = NotificationTab.All;

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);
    }

    setStatus(status: NotificationServiceConnectStatus) {
        this.status = status;
    }

    // setNotifications(notifications: NotificationModel[]) {
    //     this.notifications = notifications;
    // }

    setTotalCount(count: number) {
        this.totalCount = count;
    }

    setToasts(toasts: ToastNotification[]) {
        this.toasts = toasts;
    }

    async loadCountByFilter(payload: Record<string, unknown>) {
        try {
            const response = await Axios.post<
                JsonRpcPayload,
                AxiosResponse<IJsonRpcResponse<number>>
            >(
                notificationsEndpoint.url,
                new JsonRpcPayload("get_count_by_filter", payload),
            );

            return new JsonRpcResult({
                status: !response.data.error,
                result: response.data.result,
            });
        } catch (e) {
            console.error(e);
            return new JsonRpcFailure();
        }
    }

    async loadNotificationsByFilter(payload: object) {
        try {
            const response = await Axios.post<
                JsonRpcPayload,
                AxiosResponse<IJsonRpcResponse<INotificationResponse[]>>
            >(
                notificationsEndpoint.url,
                new JsonRpcPayload("get_list_by_filter", payload),
            );

            return new JsonRpcResult({
                status: !response.data.error,
                result: response.data.result,
            });
        } catch (e) {
            console.error(e);
            return new JsonRpcFailure();
        }
    }

    async fetchGroup(group: NotificationGroupModel, login: string) {
        group.setFetching(true);

        const countResponse = await this.loadCountByFilter({
            filter: {
                login: { values: [login] },
                app_id: { values: [group.id] },
            },
        });

        if (countResponse.status) {
            const count = countResponse.result!;
            group.setCount(count);

            const notificationsResponse = await this.loadNotificationsByFilter(
                new RequestListPayload({
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

            if (notificationsResponse.result) {
                const notifications = notificationsResponse.result.map((item) =>
                    NotificationFactory.createNotificationFromRawData(item),
                );

                group.setNotifications(notifications);
            } else {
                console.warn("No notifications list result");
            }
        } else {
            console.warn("No count notification result");
        }
        group.setFetching(false);
    }

    async fetchTotalCount(login: string) {
        const notificationsCountResponse = await Axios.post<
            JsonRpcPayload,
            AxiosResponse<IJsonRpcResponse<number>>
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

    async fetchImportantNotifications(login: string) {
        const notificationsResponse = await this.loadNotificationsByFilter({
            filter: {
                confirm: { values: ["waiting"] },
                login: { values: [login] },
            },
            limit: 1000,
            offset: 0,
            order: [{ field: "ntf_date", direction: "desc" }],
        });

        if (notificationsResponse.result) {
            const notifications = notificationsResponse.result.map((item) =>
                NotificationFactory.createNotificationFromRawData(item),
            );
            this.setImportantNotifications(notifications);
        }
    }

    async fetchNotifications(login: string) {
        try {
            await this.fetchImportantNotifications(login);
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
                JsonRpcPayload,
                AxiosResponse<IJsonRpcResponse<number>>
            >(
                notificationsAppsEndpoint.url,
                new JsonRpcPayload("get_count_by_filter", {
                    filter: {
                        login: { values: [login] },
                    },
                }),
            );

            const appsListResponse = await Axios.post<
                JsonRpcPayload,
                AxiosResponse<
                    IJsonRpcResponse<INotificationAppRelationResponse[]>
                >
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
                                NotificationFactory.createNotificationFromRawData(
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

                            this.fetchImportantNotifications(
                                this.store.auth.userLogin,
                            );

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
            if (notification.isShowBanner) {
                const expireTime = notification.isRequireConfirm
                    ? NotificationExpireTime.Long
                    : NotificationExpireTime.Short;

                this.toasts.unshift(
                    new ToastNotification({ notification, expireTime }),
                );
            }

            if (notification.isRequireConfirm) {
                this.importantNotifications.push(notification);
            }

            const group = this.groups.find(
                (item) => item.id === notification.applicationId,
            );
            if (group) {
                this.fetchGroup(group, this.store.auth.userLogin);
            }
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

    async removeNotificationsByGroup(
        group: NotificationGroupModel,
        login: string,
    ) {
        group.setLocked(true);

        const loop = async () => {
            const deleteCount = 100;
            const countResponse = await this.loadCountByFilter({
                filter: {
                    login: { values: [login] },
                    app_id: { values: [group.id] },
                    confirm: { values: ["disabled"] },
                },
            });
            if (countResponse.status) {
                const count = countResponse.result!;

                if (count > 0) {
                    const notificationsResponse =
                        await this.loadNotificationsByFilter(
                            new RequestListPayload({
                                filter: {
                                    app_id: {
                                        values: [group.id],
                                    },
                                    login: { values: [login] },
                                    confirm: { values: ["disabled"] },
                                },
                                limit: deleteCount,
                                order: [
                                    { field: "ntf_date", direction: "desc" },
                                ],
                            }),
                        );

                    if (notificationsResponse.result) {
                        const removeResponse = await this.removeNotifications(
                            notificationsResponse.result.map(
                                (item) => item.ntf_id,
                            ),
                            login,
                        );

                        if (removeResponse.status) {
                            loop();
                        }
                    }
                } else {
                    group.setLocked(false);
                    this.fetchGroup(group, login);
                }
            }
        };

        await loop();
    }

    async removeNotifications(ids: string[], login: string) {
        try {
            const response = await Axios.post<
                JsonRpcPayload,
                AxiosResponse<IJsonRpcResponse>
            >(
                notificationsEndpoint.url,
                new JsonRpcPayload("drop_user_notifications", {
                    user_notifications: ids.map((item) => ({
                        ntf_id: item,
                        login,
                    })),
                }),
            );

            return new JsonRpcResult({
                status: !response.data.error,
                result: response.data.result,
            });
        } catch (e) {
            console.error(e);
            return new JsonRpcFailure();
        }
    }

    setTab(value: NotificationTab) {
        this.tab = value;
    }

    setImportantNotifications(notifications: NotificationModel[]) {
        this.importantNotifications = notifications;
    }

    showInstruction(isShow: boolean, text?: string) {
        this.isShowInstruction = isShow;
        if (text) {
            this.instructionText = text;
        }
    }
}
