interface INotificationModelOptions {
    id: string;
    applicationId: string;
    title: string;
    text: string;
    url: string;
    date: string;
}

export class NotificationModel implements INotificationModelOptions {
    id: string;
    applicationId: string;
    title: string;
    text: string;
    url: string;
    date: string;
    constructor(options: INotificationModelOptions) {
        this.id = options.id;
        this.applicationId = options.applicationId;
        this.title = options.title;
        this.text = options.text;
        this.url = options.url;
        this.date = options.date;
    }
}
