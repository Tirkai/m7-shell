export interface INotificationResponse {
    ntf_id: string;
    app_id: string;
    ntf_date: string;
    data: {
        ACTION_URL: string;
        CONTENT_TEXT: string;
        CONTENT_TITLE: string;
        show_banner: boolean;
        play_sound: boolean;
        require_confirm: boolean;
        instruction: string;
    };
}
