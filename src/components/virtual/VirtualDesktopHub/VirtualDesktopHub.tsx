import { Add } from "@material-ui/icons";
import { BaseHub } from "components/hub/BaseHub/BaseHub";
import { ViewportAppTilePreview } from "components/virtual/ViewportAppTilePreview/ViewportAppTilePreview";
import { ShellPanelType } from "enum/ShellPanelType";
import { TileFactory } from "factories/TileFactory";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { DisplayModeType } from "models/display/DisplayModeType";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import React from "react";
import { ViewportAppWindowPreview } from "../ViewportAppWindowPreview/ViewportAppWindowPreview";
import { VirtualFrameList } from "../VirtualFrameList/VirtualFrameList";
import { VirtualFramePreview } from "../VirtualFramePreview/VirtualFramePreview";
import style from "./style.module.css";

const className = style.virtualDesktopHub;

export const VirtualDesktopHub = observer(() => {
    const store = useStore();

    const handleSetViewport = (viewport: VirtualViewportModel) => {
        store.virtualViewport.setCurrentViewport(viewport);
        store.shell.setActivePanel(ShellPanelType.None);
    };

    const handleCreateViewport = () => {
        const viewport = new VirtualViewportModel();

        viewport.setDisplayMode(store.display.defaultDisplayMode);

        viewport.setTilePreset(
            TileFactory.createTilePreset(store.tile.defaultTileTemplate),
        );

        store.virtualViewport.addViewport(viewport);
    };

    const handleRemoveViewport = (viewport: VirtualViewportModel) => {
        store.virtualViewport.removeViewport(viewport);
    };

    const getProcessesByViewport = (viewport: VirtualViewportModel) =>
        store.processManager.processes.filter(
            (process) => process.window.viewport.id === viewport.id,
        );

    return (
        <BaseHub
            show={store.shell.activePanel === ShellPanelType.Virtual}
            width="100%"
        >
            <div className={style.virtualDesktopHub}>
                <div className={style.container}>
                    <div className={style.frames}>
                        <div className={style.framesContainer}>
                            <VirtualFrameList
                                count={store.virtualViewport.viewports.length}
                            >
                                {/* TODO: Refactor  */}
                                {store.virtualViewport.viewports.map(
                                    (item, index) => (
                                        <VirtualFramePreview
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
                                            onDelete={
                                                store.virtualViewport.viewports
                                                    .length > 1
                                                    ? () =>
                                                          handleRemoveViewport(
                                                              item,
                                                          )
                                                    : undefined
                                            }
                                            hasControls
                                            viewport={item}
                                        >
                                            {item.displayMode.type ===
                                                DisplayModeType.Tile && (
                                                <ViewportAppTilePreview
                                                    areas={
                                                        item.tilePreset.areas
                                                    }
                                                    columns={
                                                        item.tilePreset.columns
                                                    }
                                                    rows={item.tilePreset.rows}
                                                    processes={getProcessesByViewport(
                                                        item,
                                                    )}
                                                />
                                            )}
                                            {item.displayMode.type ===
                                                DisplayModeType.Float && (
                                                <ViewportAppWindowPreview
                                                    processes={getProcessesByViewport(
                                                        item,
                                                    )}
                                                />
                                            )}
                                        </VirtualFramePreview>
                                    ),
                                )}
                                <VirtualFramePreview
                                    onClick={handleCreateViewport}
                                    active={false}
                                >
                                    <Add />
                                </VirtualFramePreview>
                            </VirtualFrameList>
                        </div>
                    </div>
                </div>
            </div>
        </BaseHub>
    );
});

export default VirtualDesktopHub;
