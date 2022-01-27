import { makeAutoObservable } from "mobx";
import { NotificationCategoryType } from "./NotificationCategoryType";
import { NotificationGroupModel } from "./NotificationGroupModel";

interface INotificationCategoryOptions {
    type: NotificationCategoryType;
    name: string;
    filter?: object;
    icon?: string;
    groups?: NotificationGroupModel[];
}

export class NotificationCategory {
    type: NotificationCategoryType;
    filter: object;
    name: string;
    icon: string;
    groups: NotificationGroupModel[];

    get count() {
        return this.groups
            .map((group) => group.notifications.length)
            .reduce((acc, value) => acc + value, 0);
    }

    get hasItems() {
        return this.count > 0;
    }

    constructor(options: INotificationCategoryOptions) {
        this.type = options.type;
        this.filter = options.filter ?? {};
        this.groups = options.groups ?? [];
        this.icon = options.icon ?? "";
        this.name = options.name;
        makeAutoObservable(this);
    }

    setGroups(groups: NotificationGroupModel[]) {
        this.groups = groups;
    }
}
