import { INotificationResponse } from "interfaces/response/INotificationResponse";
import { ExternalApplication } from "models/app/ExternalApplication";
import { NotificationGroupModel } from "models/notification/NotificationGroupModel";
import { NotificationModel } from "models/notification/NotificationModel";

export class NotificationFactory {
    static createNotificationGroup(app: ExternalApplication) {
        return new NotificationGroupModel({
            id: app.id,
            name: app.name,
            icon: app.icon,
            count: 0,
            notifications: [],
        });
    }

    static createNotificationFromRawData(
        notificationData: INotificationResponse,
    ) {
        const title = notificationData.data?.CONTENT_TITLE ?? "Без заголовка";
        const text = notificationData.data?.CONTENT_TEXT ?? "";
        const url = notificationData.data?.ACTION_URL ?? "";
        const isPlaySound = notificationData.data?.play_sound ?? false;
        const isShowBanner = notificationData.data?.show_banner ?? false;
        const isRequireConfirm =
            notificationData.confirm === "waiting" ?? false;
        const instruction = notificationData.data?.instruction ?? "";

        return new NotificationModel({
            id: notificationData.ntf_id,
            applicationId: notificationData.app_id,
            title,
            text,
            url,
            date: notificationData.ntf_date,
            isPlaySound,
            isShowBanner,
            isRequireConfirm,
            instruction,
        });
    }
}
