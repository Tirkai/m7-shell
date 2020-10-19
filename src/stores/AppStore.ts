import { ApplicationManagerStore } from "./ApplicationManagerStore";
import { AudioStore } from "./AudioStore";
import { AuthStore } from "./AuthStore";
import { DateTimeStore } from "./DateTimeStore";
import { LocaleStore } from "./LocaleStore";
import { MessageStore } from "./MessageStore";
import { NotificationStore } from "./NotificationStore";
import { ShellStore } from "./ShellStore";
import { WindowManagerStore } from "./WindowManagerStore";

export class AppStore {
    auth: AuthStore;
    dateTime: DateTimeStore;
    applicationManager: ApplicationManagerStore;
    windowManager: WindowManagerStore;
    shell: ShellStore;
    notification: NotificationStore;
    locale: LocaleStore;
    message: MessageStore;
    audio: AudioStore;
    constructor() {
        this.auth = new AuthStore(this);
        this.dateTime = new DateTimeStore(this);
        this.applicationManager = new ApplicationManagerStore(this);
        this.windowManager = new WindowManagerStore(this);
        this.shell = new ShellStore(this);
        this.notification = new NotificationStore(this);
        this.locale = new LocaleStore(this);
        this.message = new MessageStore(this);
        this.audio = new AudioStore(this);
        console.warn("STORE", this);
    }
}
