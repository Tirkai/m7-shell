import { AudioContainer } from "components/audio/AudioContainer/AudioContainer";
import { AudioHub } from "components/audio/AudioHub/AudioHub";
import { ShellContextMenu } from "components/contextMenu/ShellContextMenu/ShellContextMenu";
import { ShellContextMenuOverlay } from "components/contextMenu/ShellContextMenuOverlay/ShellContextMenuOverlay";
import { BuildVersion } from "components/debug/BuildVersion/BuildVersion";
import { DesktopContainer } from "components/desktop/DesktopContainer/DesktopContainer";
import { DesktopForeground } from "components/desktop/DesktopForeground/DesktopForeground";
import { DesktopLayer } from "components/layer/DesktopLayer/DesktopLayer";
import { NotificationHub } from "components/notifications/NotificationHub/NotificationHub";
import { NotificationToasts } from "components/notifications/NotificationToasts/NotificationToasts";
import { AppsMenu } from "components/task/AppsMenu/AppsMenu";
import { TaskBar } from "components/task/TaskBar/TaskBar";
import { TileChooseHub } from "components/tile/TileChooseHub/TileChooseHub";
import { TileDesktopContainer } from "components/tile/TileDesktopContainer/TileDesktopContainer";
import { AppWindowArea } from "components/window/AppWindowArea/AppWindowArea";
import { AppWindowPinContainer } from "components/window/AppWindowPinContainer/AppWindowPinContainer";
import { ShellEvents } from "enum/ShellEvents";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { ApplicationProcess } from "models/ApplicationProcess";
import { ApplicationWindow } from "models/ApplicationWindow";
import { ExternalApplication } from "models/ExternalApplication";
import React, { Component } from "react";
import { v4 } from "uuid";
import { DesktopLayout } from "../DesktopLayout/DesktopLayout";
import style from "./style.module.css";

@inject("store")
@observer
export class ShellScreen extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    async componentDidMount() {
        await this.store.user.fetchUsername();
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
                    const appProcess = new ApplicationProcess({
                        app,
                        window: new ApplicationWindow({
                            isFullscreen: isAutorunFullscreen,
                        }),
                    });

                    this.store.processManager.execute(appProcess);
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

                const appProcess = new ApplicationProcess({
                    app,
                    window: new ApplicationWindow({
                        isFullscreen: isAutorunFullscreen,
                    }),
                });

                this.store.processManager.execute(appProcess);
            }
        }
    }

    handleClickDesktop = () => {
        window.dispatchEvent(new CustomEvent(ShellEvents.DesktopClick));
    };

    render() {
        return (
            <div className={style.shellScreen}>
                <DesktopLayout
                    desktop={
                        <DesktopContainer>
                            <DesktopLayer enabled priority={1}>
                                <DesktopForeground
                                    onDesktopClick={this.handleClickDesktop}
                                />
                            </DesktopLayer>
                            <DesktopLayer enabled priority={1}>
                                <AppWindowArea
                                    disabled={this.store.desktop.isEditMode}
                                />
                            </DesktopLayer>
                            <DesktopLayer
                                enabled={
                                    // true
                                    this.store.windowManager.hasDraggedWindow
                                }
                                priority={2}
                            >
                                <TileDesktopContainer />
                            </DesktopLayer>
                            <DesktopLayer enabled priority={2}>
                                <TileChooseHub />
                            </DesktopLayer>
                            <DesktopLayer enabled priority={3}>
                                <AppsMenu />
                            </DesktopLayer>
                            <DesktopLayer enabled priority={3}>
                                <NotificationToasts />
                                <NotificationHub />
                            </DesktopLayer>
                            <DesktopLayer enabled priority={3}>
                                <AppWindowPinContainer />
                            </DesktopLayer>
                            <DesktopLayer enabled priority={3}>
                                <AudioContainer />
                                <AudioHub />
                            </DesktopLayer>
                            <DesktopLayer enabled={false} priority={4}>
                                <BuildVersion />
                            </DesktopLayer>
                        </DesktopContainer>
                    }
                    taskBar={<TaskBar />}
                />

                <ShellContextMenuOverlay />
                <ShellContextMenu />
            </div>
        );
    }
}
