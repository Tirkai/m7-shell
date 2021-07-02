import { INotificationResponse } from "interfaces/response/INotificationResponse";
import { NotificationModel } from "models/notification/NotificationModel";
import moment from "moment";
import { v4 } from "uuid";

export class NotificationFactory {
    static createNotificationBySystem() {
        const notification = new NotificationModel({
            id: v4(),
            applicationId: v4(),
            title: "Test",
            text: "Test",
            url: "",
            date: moment().toISOString(),
        });
        return notification;
    }

    static createNotificationFromRawData(
        notificationData: INotificationResponse,
    ) {
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
