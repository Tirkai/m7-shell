import { TaskBar } from "components/task/TaskBar/TaskBar";
import { AppWindow } from "components/window/AppWindow/AppWindow";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { ApplicationWindow } from "models/ApplicationWindow";
import { ExternalApllication } from "models/ExternalApplication";
import React, { Component } from "react";
import { ResizeCallbackData } from "react-resizable";
import { v4 } from "uuid";
import style from "./style.module.css";
@inject("store")
@observer
export class ShellScreen extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    async componentDidMount() {
        await this.store.applicationManager.fetchApplications();

        const urlParams = new URL(window.location.href).searchParams;

        const autoRunApp = urlParams.get("autoRunApp");

        const autoRunUrl = urlParams.get("autoRunUrl");

        console.debug({ autoRunApp, autoRunUrl });

        if (autoRunApp) {
            const app = this.store.applicationManager.findByKey(autoRunApp);

            if (app) {
                this.store.applicationManager.executeApplication(app);
            }
        }

        if (autoRunUrl) {
            const app = new ExternalApllication({
                id: v4(),
                name: autoRunUrl,
                url: autoRunUrl,
            });

            this.store.applicationManager.executeApplication(app);
        }
    }

    hanldeWindowResizeStart = (
        appWindow: ApplicationWindow,
        event: MouseEvent,
        data: ResizeCallbackData,
    ) => {
        appWindow.setResizing(true);
        appWindow.setResizeOriginPoint(event.clientX, event.clientY);
    };

    handleWindowResize = (
        appWindow: ApplicationWindow,
        event: MouseEvent,
        data: ResizeCallbackData,
    ) => {
        appWindow.resize(event, data);
    };

    handleCloseWindow = (appWindow: ApplicationWindow) => {
        this.store.windowManager.closeWindow(appWindow);
    };

    render() {
        return (
            <div className={style.shellScreen}>
                {this.store.windowManager.windows.length}
                {this.store.windowManager.windows.map((appWindow) => (
                    <AppWindow
                        key={appWindow.id}
                        {...appWindow}
                        window={appWindow}
                        onResizeStart={(event, data) =>
                            this.hanldeWindowResizeStart(appWindow, event, data)
                        }
                        onResizeStop={() => appWindow.setResizing(false)}
                        onResize={(event, data) =>
                            this.handleWindowResize(appWindow, event, data)
                        }
                        onDragStart={() => appWindow.setDragging(true)}
                        onDragStop={() => appWindow.setDragging(false)}
                        onDrag={(event, data) =>
                            appWindow.setPosition(data.x, data.y)
                        }
                        onClose={() => this.handleCloseWindow(appWindow)}
                    />
                ))}

                <TaskBar />
            </div>
        );
    }
}

export default ShellScreen;
