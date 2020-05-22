import { TaskBar } from "components/task/TaskBar/TaskBar";
import { AppWindow } from "components/window/AppWindow/AppWindow";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { ApplicationWindow } from "models/ApplicationWindow";
import React, { Component } from "react";
import { ResizeCallbackData } from "react-resizable";
import style from "./style.module.css";
@inject("store")
@observer
export class ShellScreen extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    componentDidMount() {
        this.store.applicationManager.fetchApplications();
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
