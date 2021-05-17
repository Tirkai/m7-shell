import { ApplicationManagerStore } from "./ApplicationManagerStore";
import { AudioStore } from "./AudioStore";
import { AuthStore } from "./AuthStore";
import { ContextMenuStore } from "./ContextMenuStore";
import { DateTimeStore } from "./DateTimeStore";
import { DesktopStore } from "./DesktopStore";
import { DisplayManager } from "./DisplayManager";
import { HotkeyStore } from "./HotkeyStore";
import { LocaleStore } from "./LocaleStore";
import { MessageStore } from "./MessageStore";
import { NetworkStore } from "./NetworkStore";
import { NotificationStore } from "./NotificationStore";
import { PinManager } from "./PinManager";
import { ProcessManagerStore } from "./ProcessManagerStore";
import { RecoveryStore } from "./RecoveryStore";
import { SharedEventBus } from "./SharedEventBus";
import { ShellStore } from "./ShellStore";
import { TileManager } from "./TileManager";
import { UserDatabaseManager } from "./UserDataManager";
import { UserStore } from "./UserStore";
import { VirtualViewportManager } from "./VirtualViewportManager";
import { WindowManagerStore } from "./WindowManagerStore";

export class AppStore {
    sharedEventBus: SharedEventBus;
    userDatabase: UserDatabaseManager;
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
    desktop: DesktopStore;
    tile: TileManager;
    pin: PinManager;
    virtualViewport: VirtualViewportManager;
    hotkey: HotkeyStore;
    display: DisplayManager;
    recovery: RecoveryStore;
    constructor() {
        this.sharedEventBus = new SharedEventBus(this);
        this.userDatabase = new UserDatabaseManager(this);
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
        this.desktop = new DesktopStore(this);
        this.tile = new TileManager(this);
        this.pin = new PinManager(this);
        this.virtualViewport = new VirtualViewportManager(this);
        this.hotkey = new HotkeyStore(this);
        this.display = new DisplayManager(this);
        this.auth = new AuthStore(this);
        this.recovery = new RecoveryStore(this);

        console.warn("STORE", this);

        (window as any).store = this;
    }
}
