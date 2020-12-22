import { action, makeAutoObservable } from "mobx";

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

    isDisplayed: boolean;

    constructor(options: INotificationModelOptions) {
        makeAutoObservable(this);

        this.id = options.id;
        this.applicationId = options.applicationId;
        this.title = options.title;
        this.text = options.text;
        this.url = options.url;
        this.date = options.date;
        this.isDisplayed = true;
    }

    @action
    setDisplayed(value: boolean) {
        this.isDisplayed = value;
    }
}
