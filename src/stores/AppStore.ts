import { ApplicationManagerStore } from "./ApplicationManagerStore";
import { AudioStore } from "./AudioStore";
import { AuthStore } from "./AuthStore";
import { ContextMenuStore } from "./ContextMenuStore";
import { DateTimeStore } from "./DateTimeStore";
import { LocaleStore } from "./LocaleStore";
import { MessageStore } from "./MessageStore";
import { NetworkStore } from "./NetworkStore";
import { NotificationStore } from "./NotificationStore";
import { ProcessManagerStore } from "./ProcessManagerStore";
import { ShellStore } from "./ShellStore";
import { UserStore } from "./UserStore";
import { WindowManagerStore } from "./WindowManagerStore";

export class AppStore {
    auth: AuthStore;
    dateTime: DateTimeStore;
    processManager: ProcessManagerStore;
    applicationManager: ApplicationManagerStore;
    windowManager: WindowManagerStore;
    shell: ShellStore;
    notification: NotificationStore;
    locale: LocaleStore;
    message: MessageStore;
    audio: AudioStore;
    contextMenu: ContextMenuStore;
    user: UserStore;
    network: NetworkStore;
    constructor() {
        this.auth = new AuthStore(this);
        this.dateTime = new DateTimeStore(this);
        this.processManager = new ProcessManagerStore(this);
        this.applicationManager = new ApplicationManagerStore(this);
        this.windowManager = new WindowManagerStore(this);
        this.shell = new ShellStore(this);
        this.notification = new NotificationStore(this);
        this.locale = new LocaleStore(this);
        this.message = new MessageStore(this);
        this.audio = new AudioStore(this);
        this.contextMenu = new ContextMenuStore(this);
        this.user = new UserStore(this);
        this.network = new NetworkStore(this);
        console.warn("STORE", this);
    }
}
