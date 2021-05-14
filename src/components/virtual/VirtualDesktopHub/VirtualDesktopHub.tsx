import { SVGIcon } from "@algont/m7-ui";
import { Add } from "@material-ui/icons";
import { BaseHub } from "components/hub/BaseHub/BaseHub";
import { TileAppPreviewGrid } from "components/tile/TileAppPreviewGrid/TileAppPreviewGrid";
import { TileAppPreviewItem } from "components/tile/TileAppPreviewItem/TileAppPreviewItem";
import { ShellPanelType } from "enum/ShellPanelType";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import React from "react";
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
        const current = store.virtualViewport.currentViewport;

        const viewport = new VirtualViewportModel();
        store.virtualViewport.addViewport(viewport, current.tilePreset);
    };

    const handleRemoveViewport = (viewport: VirtualViewportModel) => {
        store.virtualViewport.removeViewport(viewport);
    };

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
                                {store.virtualViewport.viewports.map((item) => (
                                    <VirtualFramePreview
                                        key={item.id}
                                        onClick={() => handleSetViewport(item)}
                                        active={
                                            store.virtualViewport
                                                .currentViewport?.id === item.id
                                        }
                                        onDelete={() =>
                                            handleRemoveViewport(item)
                                        }
                                        hideDeleteControl={
                                            store.virtualViewport.viewports
                                                .length <= 1
                                        }
                                        templates={store.tile.templates}
                                        preset={item.tilePreset}
                                        viewport={item}
                                    >
                                        <TileAppPreviewGrid
                                            enabledTiles={
                                                item.displayMode
                                                    .enableTileAttach
                                            }
                                            areas={item.tilePreset.areas}
                                            columns={item.tilePreset.columns}
                                            rows={item.tilePreset.rows}
                                        >
                                            {store.processManager.processes
                                                .filter(
                                                    (process) =>
                                                        process.window.viewport
                                                            .id === item.id,
                                                )
                                                .map((process) => (
                                                    <TileAppPreviewItem
                                                        key={process.id}
                                                        area={
                                                            process.window.area
                                                        }
                                                        icon={
                                                            <SVGIcon
                                                                source={
                                                                    process.app
                                                                        .icon
                                                                }
                                                                size={{
                                                                    width:
                                                                        "32px",
                                                                    height:
                                                                        "32px",
                                                                }}
                                                                color="white"
                                                            />
                                                        }
                                                        title={process.app.name}
                                                    />
                                                ))}
                                        </TileAppPreviewGrid>
                                    </VirtualFramePreview>
                                ))}
                                <VirtualFramePreview
                                    onClick={handleCreateViewport}
                                    active={false}
                                    templates={[]}
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
