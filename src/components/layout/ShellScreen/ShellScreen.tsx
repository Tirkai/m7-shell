import { videocam } from "assets/icons";
import { TaskBar } from "components/task/TaskBar/TaskBar";
import { AppWindow } from "components/window/AppWindow/AppWindow";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { ApplicationWindow } from "models/ApplicationWindow";
import { ExternalApllication } from "models/ExternalApplication";
import { ShellApplication } from "models/ShellApplication";
import React, { Component } from "react";
import { ResizeCallbackData } from "react-resizable";
import { WelcomeShellApp } from "shell-apps/WelcomeShellApp/WelcomeShellApp";
import { v4 } from "uuid";
import style from "./style.module.css";

@inject("store")
@observer
export class ShellScreen extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    componentDidMount() {
        this.store.applicationManager.addApplication(
            new ExternalApllication({
                id: v4(),
                name: "АССаД-Видео",
                url: "http://video.test1/lab/setup",
                icon: videocam,
            }),
        );

        this.store.applicationManager.addApplication(
            new ExternalApllication({
                id: v4(),
                name: "ExampleExternalApp",
                url: "http://tirkai.ru",
                baseWidth: 800,
                baseHeight: 600,
            }),
        );

        this.store.applicationManager.addApplication(
            new ShellApplication({
                id: v4(),
                name: "WelcomeShellApp",
                Component: <WelcomeShellApp />,
                baseWidth: 500,
                baseHeight: 600,
            }),
        );

        this.store.applicationManager.addApplication(
            new ExternalApllication({
                id: v4(),
                name: "MobxDocs",
                url: "https://mobx.js.org/refguide/observable-decorator.html",
                baseWidth: 500,
                baseHeight: 700,
            }),
        );

        const welcome = this.store.applicationManager.findByName(
            "WelcomeShellApp",
        );
        console.log(welcome);
        if (welcome) {
            this.store.applicationManager.executeApplication(welcome);
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
