import { makeAutoObservable } from "mobx";

interface INotificationModelOptions {
    id: string;
    applicationId: string;
    title: string;
    text: string;
    url: string;
    date: string;
    isShowBanner: boolean;
    isPlaySound: boolean;
    isRequireConfirm: boolean;
    instruction?: string;
}

export class NotificationModel implements INotificationModelOptions {
    id: string;
    applicationId: string;
    title: string;
    text: string;
    url: string;
    date: string;
    isShowBanner: boolean;
    isPlaySound: boolean;
    isRequireConfirm: boolean;
    instruction: string;

    isDisplayed: boolean;

    constructor(options: INotificationModelOptions) {
        makeAutoObservable(this);

        this.id = options.id;
        this.applicationId = options.applicationId;
        this.title = options.title;
        this.text = options.text;
        this.url = options.url;
        this.date = options.date;
        this.isShowBanner = options.isShowBanner;
        this.isPlaySound = options.isPlaySound;
        this.isRequireConfirm = options.isRequireConfirm;
        this.instruction = options.instruction ?? "";

        this.isDisplayed = true;
    }

    get hasInstruction() {
        return this.instruction.length > 0;
    }

    setDisplayed(value: boolean) {
        this.isDisplayed = value;
    }
}
