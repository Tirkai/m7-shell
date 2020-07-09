export interface INotificationResponse {
    ntf_id: string;
    app_id: string;
    ntf_date: string;
    data: {
        ACTION_URL: string;
        CONTENT_TEXT: string;
        CONTENT_TITLE: string;
    };
}
