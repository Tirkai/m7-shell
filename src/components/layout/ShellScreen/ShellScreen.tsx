import { AudioContainer } from "components/audio/AudioContainer/AudioContainer";
import { AudioHub } from "components/audio/AudioHub/AudioHub";
import { ShellContextMenu } from "components/contextMenu/ShellContextMenu/ShellContextMenu";
import { BuildVersion } from "components/debug/BuildVersion/BuildVersion";
import { NotificationHub } from "components/notifications/NotificationHub/NotificationHub";
import { NotificationToasts } from "components/notifications/NotificationToasts/NotificationToasts";
import { AppsMenu } from "components/task/AppsMenu/AppsMenu";
import { TaskBar } from "components/task/TaskBar/TaskBar";
import { AppWindow } from "components/window/AppWindow/AppWindow";
import { AppWindowPinContainer } from "components/window/AppWindowPinContainer/AppWindowPinContainer";
import { ResizeHandleDirection } from "enum/ResizeHandleDirection";
import { ShellEvents } from "enum/ShellEvents";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { ApplicationWindow } from "models/ApplicationWindow";
import { ExternalApplication } from "models/ExternalApplication";
import React, { Component } from "react";
import { DraggableData, DraggableEvent } from "react-draggable";
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
        const enableAutoRun = urlParams.get("enableAutoRun");
        const autoRunApp = urlParams.get("autoRunApp");
        const autoRunUrl = urlParams.get("autoRunUrl");
        const autoRunFullscreen = urlParams.get("autoRunFullscreen");

        if (!!parseInt(enableAutoRun ?? "0")) {
            const isAutorunFullscreen = !!parseInt(autoRunFullscreen ?? "0");

            if (autoRunApp) {
                const app = this.store.applicationManager.findByKey(autoRunApp);

                if (app) {
                    this.store.applicationManager.executeApplication(app);
                }
            }

            if (autoRunUrl) {
                const app = new ExternalApplication({
                    id: v4(),
                    name: autoRunUrl,
                    url: autoRunUrl,
                    isFullscreen: isAutorunFullscreen,
                    isVisibleInStartMenu: false,
                });

                this.store.applicationManager.addApplication(app);

                this.store.applicationManager.executeApplication(app);
            }
        }

        this.store.notification.connectToNotificationsSocket(
            this.store.auth.accessToken,
        );
    }

    handleWindowResizeStart = (
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
        const size = data.size;
        let position = { x: event.clientX, y: event.clientY };

        if (
            data.handle === ResizeHandleDirection.NorthEast ||
            data.handle === ResizeHandleDirection.NorthWest ||
            data.handle === ResizeHandleDirection.SouthEast ||
            data.handle === ResizeHandleDirection.SouthWest
        ) {
            if (
                appWindow.width < appWindow.application.minWidth ||
                appWindow.height < appWindow.application.minHeight
            ) {
                position = {
                    x: appWindow.minXPosition,
                    y: appWindow.minYPosition,
                };
                event.preventDefault();
            }
        } else {
            if (appWindow.width < appWindow.application.minWidth) {
                position = {
                    x: appWindow.minXPosition,
                    y: event.clientY,
                };
            }
            if (appWindow.height < appWindow.application.minHeight) {
                position = {
                    x: event.clientX,
                    y: appWindow.minYPosition,
                };
            }
        }

        appWindow.resize(data.handle, position, size);
    };

    handleCloseWindow = (appWindow: ApplicationWindow) => {
        this.store.windowManager.closeWindow(appWindow);
    };

    handleDrag = (
        appWindow: ApplicationWindow,
        event: DraggableEvent,
        data: DraggableData,
    ) => {
        appWindow.setPosition(data.x, data.y);
    };

    handleClickDesktop = () => {
        window.dispatchEvent(new CustomEvent(ShellEvents.DesktopClick));
    };

    render() {
        return (
            <div className={style.shellScreen}>
                <div
                    className={style.desktop}
                    onClick={this.handleClickDesktop}
                ></div>
                {this.store.windowManager.windows.map((appWindow) => (
                    <AppWindow
                        key={appWindow.id}
                        {...appWindow}
                        window={appWindow}
                        onResizeStart={(event, data) =>
                            this.handleWindowResizeStart(appWindow, event, data)
                        }
                        onResizeStop={() => appWindow.setResizing(false)}
                        onResize={(event, data) =>
                            this.handleWindowResize(appWindow, event, data)
                        }
                        onDragStart={() => appWindow.setDragging(true)}
                        onDragStop={() => appWindow.setDragging(false)}
                        onDrag={(event, data) =>
                            this.handleDrag(appWindow, event, data)
                        }
                        onClose={() => this.handleCloseWindow(appWindow)}
                    />
                ))}

                <AppsMenu />
                <NotificationToasts />
                <NotificationHub />
                <TaskBar />
                <BuildVersion />
                <AppWindowPinContainer />
                <AudioContainer />
                <AudioHub />
                <ShellContextMenu />
            </div>
        );
    }
}
