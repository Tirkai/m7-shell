import { WindowFactory } from "factories/WindowFactory";
import { IApplicationWindowOptions } from "interfaces/window/IApplicationWindowOptions";
import { Application } from "models/app/Application";
import { ExternalApplication } from "models/app/ExternalApplication";
import {
    ApplicationProcess,
    IApplicationProcessOptionalOptions,
} from "models/process/ApplicationProcess";
import { ApplicationWindowType } from "models/window/ApplicationWindowType";
import { AppStore } from "stores/AppStore";

interface IApplicationRunnerOptions {
    // url?: string;
    focusWindowAfterInstantiate?: boolean;
    windowOptions?: IApplicationWindowOptions;
    processOptions?: IApplicationProcessOptionalOptions;
}

export class ApplicationRunner {
    store: AppStore;
    constructor(store: AppStore) {
        this.store = store;
    }

    run(app: Application, options?: IApplicationRunnerOptions) {
        let url = "";

        if (options?.processOptions?.url) {
            url = options.processOptions.url;
        } else {
            if (app instanceof ExternalApplication) {
                url = app.url;
            }
        }

        if (!app.isExecuted) {
            const viewport =
                options?.windowOptions?.viewport ??
                this.store.virtualViewport.currentViewport;

            const currentViewport = this.store.virtualViewport.currentViewport;

            const appWindow = WindowFactory.createWindow({
                type:
                    options?.windowOptions?.type ??
                    currentViewport.displayMode?.windowType ??
                    ApplicationWindowType.Unknown,
                viewport,
                focusAfterInstantiate:
                    options?.focusWindowAfterInstantiate ?? false,
                area: options?.windowOptions?.area,
                x: options?.windowOptions?.x,
                y: options?.windowOptions?.y,
            });

            if (appWindow?.type === ApplicationWindowType.Unknown) {
                alert("Unknown application window type");
            }

            const processOptions = { ...options?.processOptions };
            const appProcess = new ApplicationProcess({
                app,
                window: appWindow,
                url,
                ...processOptions,
            });

            this.store.processManager.execute(appProcess);
        } else {
            const activeProcess =
                this.store.processManager.findProcessByApp(app);
            if (activeProcess) {
                if (options?.processOptions?.url) {
                    activeProcess.setLockedUrl("");
                    activeProcess.setUrl(options.processOptions.url);
                    activeProcess.rerollHash();
                }
                if (options?.processOptions?.params) {
                    activeProcess.setParams(options.processOptions.params);
                }
                if (options?.focusWindowAfterInstantiate) {
                    this.store.windowManager.focusWindow(activeProcess.window);
                }
            }
        }
    }
}
