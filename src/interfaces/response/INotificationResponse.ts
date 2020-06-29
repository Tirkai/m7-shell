import { NotificationDataType } from "enum/NotificationDataType";

export interface INotificationResponse {
    notification: {
        ntf_id: string;
        app_id: string;
        ntf_data: string;
    };
    data: [
        {
            data_type: NotificationDataType;
            data: string;
        },
    ];
}
