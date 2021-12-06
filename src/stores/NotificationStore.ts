import {
    GetListByFilterPayload,
    Service,
    ServiceError,
    ServiceResponse,
} from "@algont/m7-crud-helper";
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
import { ToastNotification } from "models/notification/ToastNotification";
import io from "socket.io-client";
import {
    notificationsAppsEndpoint,
    notificationsEndpoint,
} from "utils/endpoints";
import { AppStore } from "./AppStore";

export class NotificationStore {
    socket: any | null = null;

    toasts: ToastNotification[] = [];

    notificationService: Service<INotificationResponse> = new Service({
        endpoint: notificationsEndpoint,
    });

    applicationService: Service<INotificationAppRelationResponse> = new Service(
        {
            endpoint: notificationsAppsEndpoint,
        },
    );

    isShowInstruction: boolean = false;

    instructionText: string = "";

    groups: NotificationGroupModel[] = [];

    importantNotifications: NotificationModel[] = [];

    totalCount = 0;

    applications: ExternalApplication[] = [];

    get hasNotifications() {
        return this.groups.some((group) => group.hasNotifications);
    }

    get hasImportantNotifcations() {
        return this.importantNotifications.length > 0;
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

    setTotalCount(count: number) {
        this.totalCount = count;
    }

    setToasts(toasts: ToastNotification[]) {
        this.toasts = toasts;
    }

    async fetchGroup(group: NotificationGroupModel, login: string) {
        group.setFetching(true);

        const countResponse = await this.notificationService.getCount({
            payload: {
                filter: {
                    login: { values: [login] },
                    app_id: { values: [group.id] },
                },
            },
        });

        if (countResponse.result) {
            group.setCount(countResponse.result);
        }

        const notificationsResponse = await this.notificationService.getList({
            payload: new GetListByFilterPayload({
                limit: 5,
                offset: 0,
                filter: {
                    app_id: {
                        values: [group.id],
                    },
                    login: { values: [login] },
                },
            }),
        });

        if (notificationsResponse.result) {
            const notifications = notificationsResponse.result.items.map(
                (item) =>
                    NotificationFactory.createNotificationFromRawData(item),
            );

            group.setNotifications(notifications);
        } else {
            console.warn("No notifications list result");
        }

        group.setFetching(false);
    }

    async fetchTotalCount(login: string) {
        const countResponse = await this.notificationService.getCount({
            payload: {
                filter: {
                    login: { values: [login] },
                },
            },
        });

        if (countResponse.result) {
            this.setTotalCount(countResponse.result);
        }
    }

    async fetchImportantNotifications(login: string) {
        const notificationsResponse = await this.notificationService.getList({
            payload: {
                filter: {
                    confirm: { values: ["waiting"] },
                    login: { values: [login] },
                },
                limit: 1000,
                offset: 0,
                order: [{ field: "ntf_date", direction: "desc" }],
            },
        });

        if (notificationsResponse.result) {
            const notifications = notificationsResponse.result.items.map(
                (item) =>
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
            const appsCountResponse = await this.applicationService.getCount({
                payload: {
                    filter: {
                        login: { values: [login] },
                    },
                },
            });

            const appsListResponse = await this.applicationService.getList({
                payload: new GetListByFilterPayload({
                    order: [{ field: "app_name", direction: "asc" }],
                    limit: appsCountResponse.result ?? 0,
                }),
            });

            if (appsListResponse.result) {
                this.setApplications(
                    appsListResponse.result.items.map((item) =>
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
            }
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

                    this.socket.on("connect", () => this.onConnect());

                    this.socket.on(
                        "add_notification",
                        (response: INotificationResponse) =>
                            this.onAddNotification(response),
                    );

                    this.socket.on(
                        "notification_count",
                        (response: INotificationCountResponse) =>
                            this.onUpdateNotificationCount(response.total),
                    );

                    this.socket.on(
                        "delete_notification",
                        (response: INotificationResponse) =>
                            this.onDeleteNotification(response),
                    );

                    this.socket.on("disconnect", () => this.onDisconnect());

                    this.socket.on("reconnect_error", () => {
                        this.reconnectToNotificationSocket();
                    });
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

    onConnect() {
        this.setStatus(NotificationServiceConnectStatus.Connected);
    }

    onDisconnect() {
        this.setStatus(NotificationServiceConnectStatus.Disconnected);
    }

    onUpdateNotificationCount(count: number) {
        this.totalCount = count;
    }

    onAddNotification(payload: INotificationResponse) {
        this.addNotification(
            NotificationFactory.createNotificationFromRawData(payload),
        );
    }

    onDeleteNotification(payload: INotificationResponse) {
        const notificationId = payload.ntf_id;

        this.fetchImportantNotifications(this.store.auth.userLogin);

        const group = this.groups.find((groupItem) =>
            groupItem.notifications.find(
                (notifyItem) => notifyItem.id === notificationId,
            ),
        );

        if (group) {
            this.fetchGroup(group, this.store.auth.userLogin);
        }
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

            const countResponse = await this.notificationService.getCount({
                payload: {
                    filter: {
                        login: { values: [login] },
                        app_id: { values: [group.id] },
                        confirm: { values: ["disabled"] },
                    },
                },
            });

            if (countResponse.result) {
                const count = countResponse.result;
                if (count > 0) {
                    const notificationsResponse =
                        await this.notificationService.getList({
                            payload: new GetListByFilterPayload({
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
                        });

                    if (notificationsResponse.result) {
                        const removeResponse = await this.removeNotifications(
                            notificationsResponse.result.items.map(
                                (item) => item.ntf_id,
                            ),
                            login,
                        );

                        if (removeResponse.result) {
                            loop();
                        }
                    }
                }
            } else {
                group.setLocked(false);
                this.fetchGroup(group, login);
            }
        };

        await loop();
    }

    async removeNotifications(ids: string[], login: string) {
        try {
            return await this.notificationService.invoke({
                method: "drop_user_notifications",
                payload: {
                    user_notifications: ids.map((item) => ({
                        ntf_id: item,
                        login,
                    })),
                },
            });
        } catch (e) {
            return new ServiceResponse({ error: new ServiceError({}) });
        }
    }

    async confirmUserNotifications(ids: string[], login: string) {
        try {
            return await this.notificationService.invoke({
                method: "confirm_user_notifications",
                payload: {
                    user_notifications: ids.map((item) => ({
                        ntf_id: item,
                        login,
                    })),
                },
            });
        } catch (e) {
            return new ServiceResponse({ error: new ServiceError({}) });
        }
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
