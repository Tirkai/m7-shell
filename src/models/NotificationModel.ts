interface INotificationModelOptions {
    id: string;
    applicationId: string;
    title: string;
    text: string;
    url: string;
}

export class NotificationModel implements INotificationModelOptions {
    id: string;
    applicationId: string;
    title: string;
    text: string;
    url: string;
    constructor(options: INotificationModelOptions) {
        this.id = options.id;
        this.applicationId = options.applicationId;
        this.title = options.title;
        this.text = options.text;
        this.url = options.url;
    }
}
