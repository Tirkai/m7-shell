import { ApplicationManagerStore } from "./ApplicationManagerStore";
import { AuthStore } from "./AuthStore";
import { DateTimeStore } from "./DateTimeStore";
import { NotificationStore } from "./NotificationStore";
import { ShellStore } from "./ShellStore";
import { WindowManagerStore } from "./WindowManagerStore";
import { LocaleStore } from "./LocaleStore";

export class AppStore {
    auth: AuthStore;
    dateTime: DateTimeStore;
    applicationManager: ApplicationManagerStore;
    windowManager: WindowManagerStore;
    shell: ShellStore;
    notification: NotificationStore;
    locale: LocaleStore;
    constructor() {
        this.auth = new AuthStore(this);
        this.dateTime = new DateTimeStore(this);
        this.applicationManager = new ApplicationManagerStore(this);
        this.windowManager = new WindowManagerStore(this);
        this.shell = new ShellStore(this);
        this.notification = new NotificationStore(this);
        this.locale = new LocaleStore();
        console.warn("STORE", this);
    }
}
