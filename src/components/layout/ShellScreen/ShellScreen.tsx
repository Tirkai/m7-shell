import { TaskBar } from "components/task/TaskBar/TaskBar";
import { AppWindow } from "components/window/AppWindow/AppWindow";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { ExternalApllication } from "models/ExternalApplication";
import React, { Component } from "react";
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
                name: "Video",
                url: "http://video.test1/lab/setup",
            }),
        );

        this.store.applicationManager.addApplication(
            new ExternalApllication({
                name: "Video",
                url: "http://video.test1",
            }),
        );
    }

    render() {
        return (
            <div className={style.shellScreen}>
                {this.store.windowManager.windows.length}
                {this.store.windowManager.windows.map((appWindow) => (
                    <AppWindow
                        {...appWindow}
                        onResizeStart={() => appWindow.setResizing(true)}
                        onResizeStop={() => appWindow.setResizing(false)}
                        onDragStart={() => appWindow.setDragging(true)}
                        onDragStop={() => appWindow.setDragging(false)}
                    />
                ))}

                {/* <ResizableBox
                   
                >
                    <div
                        style={{
                            background: "black",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        Contents
                    </div>
                </ResizableBox> */}

                <TaskBar />
            </div>
        );
    }
}

export default ShellScreen;
