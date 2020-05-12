import { ApplicationManagerStore } from "./ApplicationManagerStore";
import { AuthStore } from "./AuthStore";
import { ShellStore } from "./ShellStore";
import { WindowManagerStore } from "./WindowManagerStore";

export class AppStore {
    auth: AuthStore;
    applicationManager: ApplicationManagerStore;
    windowManager: WindowManagerStore;
    shell: ShellStore;
    constructor() {
        this.auth = new AuthStore(this);
        this.applicationManager = new ApplicationManagerStore(this);
        this.windowManager = new WindowManagerStore(this);
        this.shell = new ShellStore(this);
        console.warn("STORE", this);
    }
}
