// import { AudioContainer } from "components/audio/AudioContainer/AudioContainer";
// import { AudioHub } from "components/audio/AudioHub/AudioHub";
import { ShellContextMenu } from "components/contextMenu/ShellContextMenu/ShellContextMenu";
import { ShellContextMenuOverlay } from "components/contextMenu/ShellContextMenuOverlay/ShellContextMenuOverlay";
import { BuildVersion } from "components/debug/BuildVersion/BuildVersion";
import { DesktopContainer } from "components/desktop/DesktopContainer/DesktopContainer";
// import { DesktopForeground } from "components/desktop/DesktopForeground/DesktopForeground";
import { DesktopLayer } from "components/layer/DesktopLayer/DesktopLayer";
// import { NotificationHub } from "components/notifications/NotificationHub/NotificationHub";
// import { NotificationToasts } from "components/notifications/NotificationToasts/NotificationToasts";
import { RecoveryDialog } from "components/recovery/RecoveryDialog/RecoveryDialog";
import { AppsMenu } from "components/task/AppsMenu/AppsMenu";
import { TaskBar } from "components/task/TaskBar/TaskBar";
// import { VirtualDesktopHub } from "components/virtual/VirtualDesktopHub/VirtualDesktopHub";
import { VirtualFrame } from "components/virtual/VirtualFrame/VirtualFrame";
import { VirtualViewport } from "components/virtual/VirtualViewport/VirtualViewport";
import { AppWindowPinContainer } from "components/window/AppWindowPinContainer/AppWindowPinContainer";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { DesktopEventType } from "models/desktop/DesktopEventType";
import { ExternalApplication } from "models/ExternalApplication";
import React, { Component, lazy, Suspense } from "react";
import { v4 } from "uuid";
import { DesktopLayout } from "../DesktopLayout/DesktopLayout";
import style from "./style.module.css";

const DesktopForeground = lazy(
    async () =>
        await import("components/desktop/DesktopForeground/DesktopForeground"),
);

const TileDesktopContainer = lazy(
    async () =>
        await import(
            "components/tile/TileDesktopContainer/TileDesktopContainer"
        ),
);

const AppWindowArea = lazy(
    async () => await import("components/window/AppWindowArea/AppWindowArea"),
);

const VirtualDesktopHub = lazy(
    async () =>
        await import("components/virtual/VirtualDesktopHub/VirtualDesktopHub"),
);

const NotificationToasts = lazy(
    async () =>
        await import(
            "components/notifications/NotificationToasts/NotificationToasts"
        ),
);

const NotificationHub = lazy(
    async () =>
        await import(
            "components/notifications/NotificationHub/NotificationHub"
        ),
);

const AudioContainer = lazy(
    async () => await import("components/audio/AudioContainer/AudioContainer"),
);

const AudioHub = lazy(
    async () => await import("components/audio/AudioHub/AudioHub"),
);

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

            const runner = new ApplicationRunner(this.store);
            if (autoRunApp) {
                const app = this.store.applicationManager.findByKey(autoRunApp);

                if (app instanceof ExternalApplication) {
                    runner.run(app);
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

                runner.run(app);
            }
        }
        this.store.recovery.fetchLastUserSession();
    }

    handleClickDesktop = () => {
        this.store.sharedEventBus.eventBus.dispatch(
            DesktopEventType.OnDesktopClick,
        );
    };

    handleRecovery = () => {
        const recovery = this.store.recovery;
        recovery.startRecovery();
        recovery.setDisplayRecoveryDialog(false);
    };

    render() {
        return (
            <div className={style.shellScreen}>
                <DesktopLayout
                    desktop={
                        <DesktopContainer>
                            <VirtualViewport
                                displayed={
                                    true
                                    // this.store.shell.activePanel !==
                                    // ShellPanelType.Virtual
                                }
                            >
                                {this.store.virtualViewport.viewports.map(
                                    (viewport) => (
                                        <VirtualFrame
                                            key={viewport.id}
                                            active={
                                                this.store.virtualViewport
                                                    .currentViewport?.id ===
                                                viewport.id
                                            }
                                        >
                                            <Suspense fallback="Loading">
                                                <DesktopLayer
                                                    enabled
                                                    priority={1}
                                                >
                                                    <DesktopForeground
                                                        onDesktopClick={
                                                            this
                                                                .handleClickDesktop
                                                        }
                                                    />
                                                </DesktopLayer>
                                            </Suspense>
                                            <Suspense fallback="Loading">
                                                <DesktopLayer
                                                    enabled
                                                    priority={2}
                                                >
                                                    <TileDesktopContainer
                                                        viewport={viewport}
                                                        preset={
                                                            viewport.tilePreset
                                                        }
                                                    />
                                                </DesktopLayer>
                                            </Suspense>
                                            <Suspense fallback="Loading">
                                                <DesktopLayer
                                                    enabled
                                                    priority={1}
                                                >
                                                    <AppWindowArea
                                                        viewport={viewport}
                                                        disabled={
                                                            this.store.desktop
                                                                .isEditMode
                                                        }
                                                    />
                                                </DesktopLayer>
                                            </Suspense>
                                        </VirtualFrame>
                                    ),
                                )}
                            </VirtualViewport>
                            <Suspense fallback="Loading">
                                <DesktopLayer enabled priority={2}>
                                    <VirtualDesktopHub />
                                </DesktopLayer>
                            </Suspense>
                            <Suspense fallback="Loading">
                                <DesktopLayer enabled priority={3}>
                                    <AppsMenu />
                                </DesktopLayer>
                            </Suspense>
                            <Suspense fallback="Loading">
                                <DesktopLayer enabled priority={3}>
                                    <NotificationToasts />
                                    <NotificationHub />
                                </DesktopLayer>
                            </Suspense>
                            <Suspense fallback="Loading">
                                <DesktopLayer enabled={false} priority={3}>
                                    <AppWindowPinContainer />
                                </DesktopLayer>
                            </Suspense>
                            <Suspense fallback="Loading">
                                <DesktopLayer enabled priority={3}>
                                    <AudioContainer />
                                    <AudioHub />
                                </DesktopLayer>
                            </Suspense>

                            <DesktopLayer enabled={false} priority={4}>
                                <BuildVersion />
                            </DesktopLayer>

                            <DesktopLayer enabled priority={4}>
                                <RecoveryDialog
                                    show={
                                        this.store.recovery
                                            .isDisplayRecoveryDialog
                                    }
                                    onRecovery={() => this.handleRecovery()}
                                    onCancel={() =>
                                        this.store.recovery.setDisplayRecoveryDialog(
                                            false,
                                        )
                                    }
                                    processes={
                                        this.store.recovery.processesSnapshot
                                            ?.processes
                                    }
                                    viewports={
                                        this.store.recovery.viewportsSnapshot
                                            ?.viewports
                                    }
                                />
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
