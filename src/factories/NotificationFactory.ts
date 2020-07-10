import { INotificationResponse } from "interfaces/response/INotificationResponse";
import { NotificationModel } from "models/NotificationModel";

export class NotificationFactory {
    static createNotification(notificationData: INotificationResponse) {
        const title = notificationData.data?.CONTENT_TITLE ?? "Без заголовка";
        const text = notificationData.data?.CONTENT_TEXT ?? "";
        const url = notificationData.data?.ACTION_URL ?? "";

        return new NotificationModel({
            id: notificationData.ntf_id,
            applicationId: notificationData.app_id,
            title,
            text,
            url,
            date: notificationData.ntf_date,
        });
    }
}
