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
import { DebounceContainer } from "models/throttle/DebounceContainer";
import { ThrottleContainer } from "models/throttle/ThrottleContainer";
import io from "socket.io-client";
import {
    notificationsAppsEndpoint,
    notificationsEndpoint,
} from "utils/endpoints";
import { AppStore } from "./AppStore";

interface IDeleteNotificationPayload {
    ntf_id: string;
    app_id: string;
    wait_next: boolean;
}

interface IGroupedNotificaitonsPayload {
    [key: string]: INotificationResponse[];
}

interface IGroupedCountsPayload {
    [key: string]: number;
}

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

    async fetchGroup(group: NotificationGroupModel) {
        group.setFetching(true);

        const countResponse = await this.notificationService.getCount({
            payload: {
                filter: {
                    login: { values: [this.store.auth.userLogin] },
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
                    login: { values: [this.store.auth.userLogin] },
                },
                order: [
                    {
                        field: "ntf_date",
                        direction: "desc",
                    },
                ],
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

    async fetchTotalCount() {
        const countResponse = await this.notificationService.getCount({
            payload: {
                filter: {
                    login: { values: [this.store.auth.userLogin] },
                },
            },
        });

        if (countResponse.result) {
            this.setTotalCount(countResponse.result);
        }
    }

    async fetchImportantNotifications() {
        const notificationsResponse = await this.notificationService.getList({
            payload: {
                filter: {
                    confirm: { values: ["waiting"] },
                    login: { values: [this.store.auth.userLogin] },
                },
                limit: 100,
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

    async fetchInitialCounts() {
        const groupedCounts =
            await this.notificationService.invoke<IGroupedCountsPayload>({
                method: "get_counts_by_apps",
                payload: {
                    filter: {
                        login: { values: [this.store.auth.userLogin] },
                    },
                },
            });

        if (groupedCounts.result) {
            Object.entries(groupedCounts.result).map(([appId, count]) => {
                const group = this.groups.find((group) => group.id === appId);

                if (group) {
                    group.setCount(count);
                }
            });
        }
    }

    async fetchInitialNotifications() {
        try {
            await this.fetchImportantNotifications();

            const groupedNotificaions =
                await this.notificationService.invoke<IGroupedNotificaitonsPayload>(
                    {
                        method: "get_lists_by_apps",
                        payload: {
                            filter: {
                                login: { values: [this.store.auth.userLogin] },
                            },
                            limit: 5,
                        },
                    },
                );

            if (groupedNotificaions.result) {
                Object.entries(groupedNotificaions.result).map(
                    ([appId, notifications]) => {
                        const group = this.groups.find(
                            (group) => group.id === appId,
                        );
                        if (group) {
                            group.setNotifications(
                                notifications.map((item) =>
                                    NotificationFactory.createNotificationFromRawData(
                                        item,
                                    ),
                                ),
                            );
                        }
                    },
                );
            }
        } catch (e) {
            console.error(e);
        }
    }

    async fetchApps() {
        try {
            const appsCountResponse = await this.applicationService.getCount({
                payload: {
                    filter: {
                        login: { values: [this.store.auth.userLogin] },
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
                    const transportOptions = {
                        polling: {
                            extraHeaders: {
                                [AUTH_TOKEN_HEADER]: token,
                            },
                        },
                    };

                    this.socket = io.connect(NOTIFICATIONS_WEBSOCKET_URL, {
                        transportOptions,
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
                        (response: IDeleteNotificationPayload) =>
                            this.onDeleteNotification(response),
                    );

                    this.socket.on(
                        "confirm_notification",
                        (response: INotificationResponse) =>
                            this.onConfirmNotification(response),
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
                this.fetchGroup(group);
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

    addingThrottleContainer: ThrottleContainer = new ThrottleContainer();
    onAddNotification(payload: INotificationResponse) {
        this.addingThrottleContainer.invoke(() => {
            this.addNotification(
                NotificationFactory.createNotificationFromRawData(payload),
            );
        }, 300);
    }

    deletionDebounceContainer: DebounceContainer = new DebounceContainer();
    onDeleteNotification(payload: IDeleteNotificationPayload) {
        this.deletionDebounceContainer.invoke(() => {
            const appId = payload.app_id;

            const group = this.groups.find(
                (groupItem) => groupItem.id === appId,
            );

            this.fetchImportantNotifications();

            if (group) {
                this.fetchGroup(group);
            }
        }, 300);
    }

    onConfirmNotification(payload: INotificationResponse) {
        const appId = payload.app_id;
        const group = this.groups.find((item) => item.id === appId);

        this.fetchImportantNotifications();

        if (group) {
            this.fetchGroup(group);
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
        const deleteCount = 100;

        const getCount = async () => {
            const countResponse = await this.notificationService.getCount({
                payload: {
                    filter: {
                        login: { values: [login] },
                        app_id: { values: [group.id] },
                    },
                },
            });
            return countResponse.result ?? 0;
        };

        let count = Infinity;

        while (count > 0) {
            try {
                count = await getCount();
                const notificationsResponse =
                    await this.notificationService.getList({
                        payload: new GetListByFilterPayload({
                            filter: {
                                app_id: {
                                    values: [group.id],
                                },
                                login: { values: [login] },
                            },
                            limit: deleteCount,
                            order: [{ field: "ntf_date", direction: "desc" }],
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
                        if (removeResponse.result.length <= 0) {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            } catch (e) {
                console.error(e);
                break;
            }
        }

        group.setLocked(false);
    }

    async removeNotifications(ids: string[], login: string) {
        try {
            return await this.notificationService.invoke<any[]>({
                method: "drop_user_notifications",
                payload: {
                    user_notifications: ids.map((item) => ({
                        ntf_id: item,
                        login,
                    })),
                },
            });
        } catch (e) {
            return new ServiceResponse({
                error: new ServiceError({}),
                result: [],
            });
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
}
