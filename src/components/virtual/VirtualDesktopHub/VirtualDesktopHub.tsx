import { BaseHub } from "components/hub/BaseHub/BaseHub";
import { TileFactory } from "factories/TileFactory";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { ShellPanelType } from "models/panel/ShellPanelType";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import React from "react";
import { VirtualFrameActions } from "../VirtualFrameActions/VirtualFrameActions";
import { VirtualFrameList } from "../VirtualFrameList/VirtualFrameList";
import { VirtualFramePreview } from "../VirtualFramePreview/VirtualFramePreview";
import style from "./style.module.css";

export const VirtualDesktopHub = observer(() => {
    const store = useStore();

    const handleSetViewport = (viewport: VirtualViewportModel) => {
        store.virtualViewport.setCurrentViewport(viewport);
        store.panelManager.setActivePanel(ShellPanelType.None);
    };

    const handleCreateViewport = () => {
        if (store.virtualViewport.viewports.length < 99) {
            const viewport = new VirtualViewportModel({
                displayMode: store.display.defaultDisplayMode,
            });

            viewport.setTilePreset(
                TileFactory.createTilePreset(store.tile.defaultTileTemplate),
            );

            store.virtualViewport.addViewport(viewport);
        }
    };

    const handleRemoveViewport = (viewport: VirtualViewportModel) => {
        store.virtualViewport.removeViewport(viewport);
    };

    const getProcessesByViewport = (viewport: VirtualViewportModel) =>
        store.processManager.processes.filter(
            (process) => process.window.viewport.id === viewport.id,
        );

    const getDeleteHandler = (viewport: VirtualViewportModel, count: number) =>
        count > 1 ? () => handleRemoveViewport(viewport) : undefined;

    return (
        <BaseHub
            show={store.panelManager.activePanel === ShellPanelType.Virtual}
            width="100%"
        >
            <div className={style.virtualDesktopHub}>
                <div className={style.container}>
                    <div className={style.frames}>
                        <div className={style.framesContainer}>
                            <VirtualFrameList
                                count={store.virtualViewport.viewports.length}
                            >
                                {store.virtualViewport.viewports
                                    .filter((item) => item.state.displayable)
                                    .map((item, index) => (
                                        <VirtualFramePreview
                                            state={item.state}
                                            displayMode={item.displayMode}
                                            processes={getProcessesByViewport(
                                                item,
                                            )}
                                            index={index + 1}
                                            key={item.id}
                                            onClick={() =>
                                                handleSetViewport(item)
                                            }
                                            active={
                                                store.virtualViewport
                                                    .currentViewport?.id ===
                                                item.id
                                            }
                                            onDelete={getDeleteHandler(
                                                item,
                                                store.virtualViewport.viewports
                                                    .length,
                                            )}
                                            hasControls
                                            viewport={item}
                                        />
                                    ))}
                            </VirtualFrameList>
                            <VirtualFrameActions onAdd={handleCreateViewport} />
                        </div>
                    </div>
                </div>
            </div>
        </BaseHub>
    );
});

export default VirtualDesktopHub;
