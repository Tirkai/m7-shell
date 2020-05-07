import { ApplicationManagerStore } from "./ApplicationManagerStore";
import { ShellStore } from "./ShellStore";
import { WindowManagerStore } from "./WindowManagerStore";

export class AppStore {
    applicationManager: ApplicationManagerStore;
    windowManager: WindowManagerStore;
    shell: ShellStore;
    constructor() {
        this.applicationManager = new ApplicationManagerStore(this);
        this.windowManager = new WindowManagerStore(this);
        this.shell = new ShellStore(this);
        console.warn("STORE", this);
    }
}
