import { NotificationDataType } from "enum/NotificationDataType";
import { INotificationResponse } from "interfaces/response/INotificationResponse";
import { NotificationModel } from "models/NotificationModel";

export class NotificationFactory {
    static createNotification(data: INotificationResponse) {
        const getDataField = (type: NotificationDataType) =>
            data.data.find((item) => item.data_type === type)?.data ?? "";

        const title = getDataField(NotificationDataType.ContentTitle);
        const text = getDataField(NotificationDataType.ContentText);
        const url = getDataField(NotificationDataType.ActionUrl);

        const notification = new NotificationModel({
            id: data.notification.ntf_id,
            applicationId: data.notification.app_id,
            title,
            text,
            url,
        });
        return notification;
    }
}
