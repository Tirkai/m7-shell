import { WindowFactory } from "factories/WindowFactory";
import { IApplicationWindowOptions } from "interfaces/window/IApplicationWindowOptions";
import { Application } from "models/app/Application";
import { ExternalApplication } from "models/app/ExternalApplication";
import { ApplicationProcess } from "models/process/ApplicationProcess";
import { IApplicationProcessState } from "models/process/IApplicationProcessState";
import { ApplicationWindowType } from "models/window/ApplicationWindowType";
import { AppStore } from "stores/AppStore";

interface IApplicationRunnerOptions {
    url?: string;
    params?: Map<string, string>;
    // viewport?: VirtualViewportModel;
    focusWindowAfterInstantiate?: boolean;
    windowOptions?: IApplicationWindowOptions;
    // windowPosition?: { x: number; y: number };
    // windowArea?: string;
    state?: IApplicationProcessState;
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
            const viewport =
                options?.windowOptions?.viewport ??
                this.store.virtualViewport.currentViewport;

            const currentViewport = this.store.virtualViewport.currentViewport;

            const appWindow = WindowFactory.createWindow(
                {
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
                },
                this.store,
            );

            if (appWindow?.type === ApplicationWindowType.Unknown) {
                alert("Unknown application window type");
            }

            const appProcess = new ApplicationProcess({
                app,
                window: appWindow,
                url,
                params: options?.params ?? new Map<string, string>(),
                state: options?.state,
            });

            this.store.processManager.execute(appProcess);
        } else {
            const activeProcess = this.store.processManager.findProcessByApp(
                app,
            );
            if (activeProcess) {
                if (options?.url) {
                    activeProcess.setLockedUrl("");
                    activeProcess.setUrl(options.url);
                    activeProcess.rerollHash();
                }
                if (options?.params) {
                    activeProcess.setParams(options.params);
                }
                if (options?.focusWindowAfterInstantiate) {
                    this.store.windowManager.focusWindow(activeProcess.window);
                }
            }
        }
    }
}
