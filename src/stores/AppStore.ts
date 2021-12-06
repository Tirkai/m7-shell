import { ApplicationManagerStore } from "./ApplicationManagerStore";
import { AudioStore } from "./AudioStore";
import { AuthStore } from "./AuthStore";
import { ConfigStore } from "./ConfigStore";
import { ContextMenuStore } from "./ContextMenuStore";
import { DateTimeStore } from "./DateTimeStore";
import { DisplayManager } from "./DisplayManager";
import { HotkeyStore } from "./HotkeyStore";
import { IncommingEventHandlerStore } from "./IncommingEventHandlerStore";
import { InstructionStore } from "./InstructionStore";
import { KioskStore } from "./KioskStore";
import { LocaleStore } from "./LocaleStore";
import { MessageStore } from "./MessageStore";
import { NotificationStore } from "./NotificationStore";
import { PanelManager } from "./PanelManager";
import { PinManager } from "./PinManager";
import { ProcessManagerStore } from "./ProcessManagerStore";
import { RecoveryStore } from "./RecoveryStore";
import { SharedEventBus } from "./SharedEventBus";
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
    panelManager: PanelManager;
    notification: NotificationStore;
    instruction: InstructionStore;
    locale: LocaleStore;
    message: MessageStore;
    audio: AudioStore;
    contextMenu: ContextMenuStore;
    user: UserStore;
    tile: TileManager;
    pin: PinManager;
    virtualViewport: VirtualViewportManager;
    hotkey: HotkeyStore;
    display: DisplayManager;
    recovery: RecoveryStore;
    config: ConfigStore;
    incommingEventHandler: IncommingEventHandlerStore;
    kiosk: KioskStore;
    constructor() {
        this.sharedEventBus = new SharedEventBus(this);
        this.userDatabase = new UserDatabaseManager(this);
        this.display = new DisplayManager(this);
        this.dateTime = new DateTimeStore(this);
        this.processManager = new ProcessManagerStore(this);
        this.applicationManager = new ApplicationManagerStore(this);
        this.windowManager = new WindowManagerStore(this);
        this.panelManager = new PanelManager(this);
        this.notification = new NotificationStore(this);
        this.instruction = new InstructionStore(this);
        this.locale = new LocaleStore(this);
        this.message = new MessageStore(this);
        this.audio = new AudioStore(this);
        this.contextMenu = new ContextMenuStore(this);
        this.user = new UserStore(this);
        this.tile = new TileManager(this);
        this.pin = new PinManager(this);
        this.virtualViewport = new VirtualViewportManager(this);
        this.hotkey = new HotkeyStore(this);
        this.auth = new AuthStore(this);
        this.recovery = new RecoveryStore(this);
        this.config = new ConfigStore(this);
        this.incommingEventHandler = new IncommingEventHandlerStore(this);
        this.kiosk = new KioskStore(this);

        (window as any).store = this;
    }
}
