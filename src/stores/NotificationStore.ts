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
import { NotificationCategory } from "models/notification/NotificationCategory";
import { NotificationCategoryType } from "models/notification/NotificationCategoryType";
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

    categories: Map<NotificationCategoryType, NotificationCategory> = new Map([
        [
            NotificationCategoryType.Common,
            new NotificationCategory({
                type: NotificationCategoryType.Common,
                name: "Все уведомления",
            }),
        ],
        [
            NotificationCategoryType.Confirmation,
            new NotificationCategory({
                type: NotificationCategoryType.Confirmation,
                name: "На подтверждение",
                filter: { confirm: { values: ["waiting"] } },
            }),
        ],
    ]);

    totalCount = 0;

    applications: ExternalApplication[] = [];

    get hasNotifications() {
        const category = this.categories.get(NotificationCategoryType.Common);

        if (!category) {
            return false;
        }

        return category.hasItems;
    }

    get hasConfirmationNotifcations() {
        const category = this.categories.get(
            NotificationCategoryType.Confirmation,
        );

        if (!category) {
            return false;
        }

        return category.hasItems;
    }

    get isActiveReminder() {
        return this.hasConfirmationNotifcations && this.toasts.length <= 0;
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

    async fetchGroup(group: NotificationGroupModel, additionalFilter?: any) {
        group.setFetching(true);

        const countResponse = await this.notificationService.getCount({
            payload: {
                filter: {
                    login: { values: [this.store.auth.userLogin] },
                    app_id: { values: [group.id] },
                    ...additionalFilter,
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
                    ...additionalFilter,
                },
                order: [
                    {
                        field: "ntf_date",
                        direction: "desc",
                    },
                ],
            }),
        });

        if (!notificationsResponse.result) {
            group.setFetching(false);
            return;
        }

        const notifications = notificationsResponse.result.items.map(
            NotificationFactory.createNotificationFromRawData,
        );

        group.setNotifications(notifications);

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

        if (!countResponse.result) {
            return;
        }
        this.setTotalCount(countResponse.result);
    }

    async fetchInitialNotifications() {
        try {
            const fillCounts = async (
                groups: NotificationGroupModel[],
                additionalFilter?: any,
            ) => {
                const groupedCounts =
                    await this.notificationService.invoke<IGroupedCountsPayload>(
                        {
                            method: "get_counts_by_apps",
                            payload: {
                                filter: {
                                    login: {
                                        values: [this.store.auth.userLogin],
                                    },
                                    ...additionalFilter,
                                },
                            },
                        },
                    );

                if (!groupedCounts.result) {
                    return;
                }
                Object.entries(groupedCounts.result).map(([appId, count]) => {
                    const group = groups.find((group) => group.id === appId);

                    if (!group) {
                        return;
                    }

                    group.setCount(count);
                });
            };

            const fillGroups = async (
                groups: NotificationGroupModel[],
                additionalFilter?: any,
            ) => {
                const groupedCommonNotificaions =
                    await this.notificationService.invoke<IGroupedNotificaitonsPayload>(
                        {
                            method: "get_lists_by_apps",
                            payload: {
                                filter: {
                                    login: {
                                        values: [this.store.auth.userLogin],
                                    },
                                    ...additionalFilter,
                                },
                                limit: 5,
                            },
                        },
                    );

                if (!groupedCommonNotificaions.result) {
                    return;
                }

                Object.entries(groupedCommonNotificaions.result).map(
                    ([appId, notifications]) => {
                        const group = groups.find(
                            (group) => group.id === appId,
                        );

                        if (!group) {
                            return;
                        }
                        group.setNotifications(
                            notifications.map((item) =>
                                NotificationFactory.createNotificationFromRawData(
                                    item,
                                ),
                            ),
                        );
                    },
                );
            };

            this.categories.forEach((category) => {
                fillCounts(category.groups, category.filter);
                fillGroups(category.groups, category.filter);
            });
        } catch (e) {
            console.error(e);
        }
    }

    async fetchApps() {
        try {
            const appsCountResponse = await this.applicationService.getCount({
                payload: {
                    filter: {},
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

                const createEmptyGroups = () =>
                    this.applications.map(
                        NotificationFactory.createNotificationGroup,
                    );

                this.categories.forEach((category) => {
                    category.setGroups(createEmptyGroups());
                });

                // this.setCommonGroups(createEmptyGroups());
                // this.setConfirmationGroups(createEmptyGroups());
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
                const expireTime = NotificationExpireTime.Short;

                if (notification.isRequireConfirm) {
                    this.toasts.unshift(
                        new ToastNotification({ notification }),
                    );
                } else {
                    this.toasts.unshift(
                        new ToastNotification({ notification, expireTime }),
                    );
                }
            }

            this.categories.forEach((category) => {
                const group = category.groups.find(
                    (item) => item.id === notification.applicationId,
                );
                if (group) {
                    this.fetchGroup(group, category.filter);
                }
            });
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

            this.categories.forEach((category) => {
                const group = category.groups.find(
                    (groupItem) => groupItem.id === appId,
                );

                if (!group) {
                    return;
                }

                this.fetchGroup(group, category.filter);
            });
        }, 300);
    }

    onConfirmNotification(payload: INotificationResponse) {
        const appId = payload.app_id;
        this.categories.forEach((category) => {
            const group = category.groups.find(
                (groupItem) => groupItem.id === appId,
            );

            if (!group) {
                return;
            }

            this.fetchGroup(group, category.filter);
        });
    }

    setApplications(apps: ExternalApplication[]) {
        this.applications = apps;
    }

    // setCommonGroups(groups: NotificationGroupModel[]) {
    //     this.commonGroups = groups;
    // }

    // setConfirmationGroups(groups: NotificationGroupModel[]) {
    //     this.confirmationGroups = groups;
    // }

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

    // setConfirmationNotifications(notifications: NotificationModel[]) {
    //     this.confirmationNotifications = notifications;
    // }
}
