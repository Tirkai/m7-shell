import { makeAutoObservable } from "mobx";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { ExternalApplication } from "models/app/ExternalApplication";
import { AuthEventType } from "models/auth/AuthEventType";
import { VirtualViewportEventType } from "models/virtual/VirtualViewportEventType";
import { ApplicationWindowType } from "models/window/ApplicationWindowType";
import { AppStore } from "stores/AppStore";
import { transformUrl } from "utils/transformUrl";

export class KioskStore {
    private store: AppStore;

    isInited: boolean = false;

    constructor(store: AppStore) {
        this.store = store;
        makeAutoObservable(this);

        this.store.sharedEventBus.eventBus.add(
            VirtualViewportEventType.OnSelectViewportFrame,
            () => {
                this.onSelectViewportFrame();
            },
        );

        this.store.sharedEventBus.eventBus.add(AuthEventType.OnLogout, () => {
            this.onLogout();
        });
    }

    onSelectViewportFrame() {
        if (!this.isInited) {
            const { kiosk } = this.store.config.config.properties;
            if (kiosk.enabled) {
                const app = new ExternalApplication({
                    name: "KioskAutorunApplication",
                    url: "",
                });

                this.startKioskApplication(app);
                this.setIsInited(true);
            }
        }
    }

    onLogout() {
        this.setIsInited(false);
    }

    startKioskApplication(app: ExternalApplication) {
        const { kiosk } = this.store.config.config.properties;

        const runner = new ApplicationRunner(this.store);

        runner.run(app, {
            processOptions: {
                ...kiosk.process.options,
                ...{
                    url: transformUrl(kiosk.process.options.url ?? ""),
                },
            },
            windowOptions: {
                type: ApplicationWindowType.Tile,
            },
            focusWindowAfterInstantiate: true,
        });
    }

    setIsInited(value: boolean) {
        this.isInited = value;
    }
}
