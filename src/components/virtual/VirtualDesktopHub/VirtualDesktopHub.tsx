import { Add } from "@material-ui/icons";
import { BaseHub } from "components/hub/BaseHub/BaseHub";
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
        const viewport = new VirtualViewportModel();
        store.virtualViewport.addViewport(viewport);
    };

    const handleDeleteViewport = (viewport: VirtualViewportModel) => {
        store.virtualViewport.removeViewport(viewport);
    };

    return (
        <BaseHub
            show={store.shell.activePanel === ShellPanelType.Virtual}
            width="100%"
            height="100%"
        >
            <div className={style.virtualDesktopHub}>
                <div className={style.container}>
                    <div className={style.applications}>Applications</div>
                    <div className={style.frames}>
                        <div className={style.framesContainer}>
                            <VirtualFrameList
                                count={store.virtualViewport.viewports.length}
                            >
                                {/* TODO: Refactor  */}
                                {store.virtualViewport.viewports.map(
                                    (item, index) => (
                                        <VirtualFramePreview
                                            onClick={() =>
                                                handleSetViewport(item)
                                            }
                                            active={
                                                store.virtualViewport
                                                    .currentViewport.id ===
                                                item.id
                                            }
                                            onDelete={
                                                store.virtualViewport.viewports
                                                    .length > 1
                                                    ? () =>
                                                          handleDeleteViewport(
                                                              item,
                                                          )
                                                    : undefined
                                            }
                                        >
                                            {index + 1}
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
