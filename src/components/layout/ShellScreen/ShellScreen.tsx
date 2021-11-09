import { ConfigCondition } from "components/config/ConfigCondition/ConfigCondition";
import { ShellContextMenu } from "components/contextMenu/ShellContextMenu/ShellContextMenu";
import { ShellContextMenuOverlay } from "components/contextMenu/ShellContextMenuOverlay/ShellContextMenuOverlay";
import { BuildVersion } from "components/debug/BuildVersion/BuildVersion";
import { DesktopContainer } from "components/desktop/DesktopContainer/DesktopContainer";
import { DesktopLayer } from "components/layer/DesktopLayer/DesktopLayer";
import { AppsMenu } from "components/menu/AppsMenu/AppsMenu";
import { RecoveryLayer } from "components/recovery/RecoveryLayer/RecoveryLayer";
import { TaskBar } from "components/task/TaskBar/TaskBar";
import { VirtualFrame } from "components/virtual/VirtualFrame/VirtualFrame";
import { VirtualViewport } from "components/virtual/VirtualViewport/VirtualViewport";
import { AppWindowPinContainer } from "components/window/AppWindowPinContainer/AppWindowPinContainer";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { AuthEventType } from "models/auth/AuthEventType";
import { DesktopEventType } from "models/desktop/DesktopEventType";
import React, { Component, lazy, Suspense } from "react";
import { DesktopLayout } from "../DesktopLayout/DesktopLayout";
import { TransparentWindowLayer } from "../TransparentWindowLayer/TransparentWindowLayer";
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

        this.store.recovery.fetchLastUserSession();

        this.store.sharedEventBus.eventBus.dispatch(AuthEventType.OnEntry);
    }

    handleClickDesktop = () => {
        this.store.sharedEventBus.eventBus.dispatch(
            DesktopEventType.OnDesktopClick,
        );
    };

    handleRecovery = () => {
        const recovery = this.store.recovery;
        if (recovery.dynamicSessionSnapshot) {
            recovery.startRecovery(recovery.dynamicSessionSnapshot);
        }
        // recovery.setDisplayRecoveryDialog(false);
    };

    handleRecoveryFreezeSnapshot = () => {
        const recovery = this.store.recovery;
        if (recovery.freezedSessionSnapshot) {
            recovery.startRecovery(recovery.freezedSessionSnapshot);
        }
        // recovery.setDisplayRecoveryDialog(false);
    };

    render() {
        const { config } = this.store.config;

        return (
            <div className={style.shellScreen}>
                <DesktopLayout
                    desktop={
                        <DesktopContainer>
                            <VirtualViewport displayed={true}>
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
                                            <ConfigCondition
                                                condition={
                                                    config.properties.layers
                                                        .foreground.enabled
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
                                            </ConfigCondition>

                                            <ConfigCondition
                                                condition={
                                                    config.properties.layers
                                                        .tileArea.enabled
                                                }
                                            >
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
                                            </ConfigCondition>

                                            <ConfigCondition
                                                condition={
                                                    config.properties.layers
                                                        .floatArea.enabled
                                                }
                                            >
                                                <Suspense fallback="Loading">
                                                    <DesktopLayer
                                                        enabled
                                                        priority={1}
                                                    >
                                                        <AppWindowArea
                                                            viewport={viewport}
                                                        />
                                                    </DesktopLayer>
                                                </Suspense>
                                            </ConfigCondition>
                                            <ConfigCondition
                                                condition={
                                                    config.properties.layers
                                                        .dashboard.enabled
                                                }
                                            >
                                                <DesktopLayer
                                                    enabled
                                                    priority={1}
                                                >
                                                    <TransparentWindowLayer
                                                        viewport={viewport}
                                                    />
                                                </DesktopLayer>
                                            </ConfigCondition>
                                        </VirtualFrame>
                                    ),
                                )}
                            </VirtualViewport>
                            <ConfigCondition
                                condition={
                                    config.properties.layers.viewportHub.enabled
                                }
                            >
                                <Suspense fallback="Loading">
                                    <DesktopLayer enabled priority={2}>
                                        <VirtualDesktopHub />
                                    </DesktopLayer>
                                </Suspense>
                            </ConfigCondition>
                            <ConfigCondition
                                condition={
                                    config.properties.layers.appsMenu.enabled
                                }
                            >
                                <Suspense fallback="Loading">
                                    <DesktopLayer enabled priority={3}>
                                        <AppsMenu />
                                    </DesktopLayer>
                                </Suspense>
                            </ConfigCondition>
                            <ConfigCondition
                                condition={
                                    config.properties.layers.notifications
                                        .enabled &&
                                    !config.properties.kiosk.enabled
                                }
                            >
                                <Suspense fallback="Loading">
                                    <DesktopLayer enabled priority={3}>
                                        <NotificationToasts />
                                        <NotificationHub />
                                    </DesktopLayer>
                                </Suspense>
                            </ConfigCondition>

                            <Suspense fallback="Loading">
                                <DesktopLayer enabled={false} priority={3}>
                                    <AppWindowPinContainer />
                                </DesktopLayer>
                            </Suspense>
                            <ConfigCondition
                                condition={
                                    config.properties.layers.audioHub.enabled
                                }
                            >
                                <Suspense fallback="Loading">
                                    <DesktopLayer enabled priority={3}>
                                        <AudioContainer />
                                        <AudioHub />
                                    </DesktopLayer>
                                </Suspense>
                            </ConfigCondition>

                            <DesktopLayer enabled={false} priority={4}>
                                <BuildVersion />
                            </DesktopLayer>
                            <ConfigCondition
                                condition={
                                    config.properties.layers.recovery.enabled &&
                                    !config.properties.kiosk.enabled
                                }
                            >
                                <DesktopLayer enabled priority={4}>
                                    <RecoveryLayer />
                                </DesktopLayer>
                            </ConfigCondition>
                        </DesktopContainer>
                    }
                    taskBar={
                        <ConfigCondition
                            condition={
                                config.properties.layers.taskbar.enabled &&
                                !config.properties.kiosk.enabled
                            }
                        >
                            <TaskBar />
                        </ConfigCondition>
                    }
                />

                <ShellContextMenuOverlay />
                <ShellContextMenu />
            </div>
        );
    }
}
