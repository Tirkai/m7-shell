import { Application } from "models/Application";
import { ApplicationProcess } from "models/ApplicationProcess";
import { ExternalApplication } from "models/ExternalApplication";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { AppStore } from "stores/AppStore";

interface IApplicationRunnerOptions {
    url?: string;
    params?: Map<string, string>;
    viewport?: VirtualViewportModel;
}

export class ApplicationRunner {
    store: AppStore;
    constructor(store: AppStore) {
        this.store = store;
    }

    run(app: Application, options?: IApplicationRunnerOptions) {
        let url = "";

        if (app instanceof ExternalApplication && !options?.url) {
            url = app.url;
        }

        if (options?.url) {
            url = options.url;
        }

        if (!app.isExecuted) {
            const appWindow = this.store.display.displayMode.windowInstantiateStrategy.instantiate(
                options?.viewport ?? this.store.virtualViewport.currentViewport,
            );

            console.log("APP_WINDOW", appWindow.viewport.id);

            const appProcess = new ApplicationProcess({
                app,
                window: appWindow,
                url,
                params: options?.params ?? new Map<string, string>(),
            });

            this.store.processManager.execute(appProcess);
        } else {
            const activeProcess = this.store.processManager.findProcessByApp(
                app,
            );
            if (activeProcess) {
                if (options?.url) {
                    activeProcess.setUrl(options.url);
                }
                if (options?.params) {
                    activeProcess.setParams(options.params);
                }
                this.store.windowManager.focusWindow(activeProcess.window);
            }
        }
    }
}
