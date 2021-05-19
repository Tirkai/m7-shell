import { IconButton } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import classNames from "classnames";
import { DisplayModeChooser } from "components/tile/DisplayModeChooser/DisplayModeChooser";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { ApplicationProcess } from "models/ApplicationProcess";
import { DisplayMode } from "models/display/DisplayMode";
import { DisplayModeType } from "models/display/DisplayModeType";
import { TileTemplate } from "models/tile/TileTemplate";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import React from "react";
import { ViewportAppTilePreview } from "../ViewportAppTilePreview/ViewportAppTilePreview";
import { ViewportAppWindowPreview } from "../ViewportAppWindowPreview/ViewportAppWindowPreview";
import { VirtualFramePreviewBase } from "../VirtualFramePreviewBase/VirtualFramePreviewBase";
import { VirtualFramePreviewLayout } from "../VirtualFramePreviewLayout/VirtualFramePreviewLayout";
import style from "./style.module.css";

interface IVirtualFramePreviewProps {
    displayMode?: DisplayMode;
    onClick?: () => void;
    onDelete?: () => void;
    active: boolean;
    // children: React.ReactNode;
    viewport?: VirtualViewportModel;
    hasControls?: boolean;
    processes: ApplicationProcess[];
    index?: number;
}

const className = style.virtualFramePreview;

export const VirtualFramePreview = observer(
    (props: IVirtualFramePreviewProps) => {
        const store = useStore();

        const handleDelete = (e: React.MouseEvent) => {
            if (props.onDelete) {
                props.onDelete();
            }
            e.stopPropagation();
        };

        const handleApplyPreset = (template: TileTemplate) => {
            const viewport = props.viewport;
            if (template && viewport) {
                store.tile.applyPresetToViewport(template, viewport);
                store.tile.setDefaultTileTemplate(template);
            }
        };

        const handleApplyDisplayMode = (displayMode: DisplayMode) => {
            const viewport = props.viewport;
            if (viewport) {
                store.display.setDefaultDisplayMode(displayMode);

                store.display.applyDisplayModeToViewport(displayMode, viewport);

                store.processManager.processes
                    .filter((item) => item.window.viewport.id === viewport.id)
                    .forEach((item) => {
                        store.windowManager.applyTypeToWindow(
                            item.window,
                            displayMode.windowType,
                        );
                    });
            } else {
                console.warn(
                    "VirtualFramePreview.handleApplyDisplayMode",
                    "viewport not exist",
                );
            }
        };

        return (
            <div className={classNames(className)}>
                <VirtualFramePreviewLayout
                    header={
                        <div className={style.header}>
                            <div className={style.indicator}>
                                <DisplayModeChooser
                                    displayMode={props.viewport?.displayMode}
                                    presetAlias={
                                        props.viewport?.tilePreset?.alias
                                    }
                                    onSelectFloatMode={(displayMode) =>
                                        handleApplyDisplayMode(displayMode)
                                    }
                                    onSelectTileMode={(
                                        displayMode,
                                        template,
                                    ) => {
                                        handleApplyDisplayMode(displayMode);
                                        handleApplyPreset(template);
                                    }}
                                />
                            </div>
                            {props.index && (
                                <div className={style.title}>
                                    Рабочий стол {props.index}
                                </div>
                            )}
                            {props.onDelete && (
                                <div className={style.actions}>
                                    <IconButton
                                        size="small"
                                        color="secondary"
                                        onClick={handleDelete}
                                    >
                                        <Clear />
                                    </IconButton>
                                </div>
                            )}
                        </div>
                    }
                    content={
                        <div
                            className={classNames(style.container)}
                            onClick={props.onClick}
                        >
                            <VirtualFramePreviewBase>
                                <div
                                    className={classNames(style.content, {
                                        [style.active]: props.active,
                                    })}
                                >
                                    {props.displayMode?.type ===
                                        DisplayModeType.Tile && (
                                        <ViewportAppTilePreview
                                            areas={
                                                props.viewport?.tilePreset
                                                    ?.areas ?? "a"
                                            }
                                            columns={
                                                props.viewport?.tilePreset
                                                    ?.columns ?? 0
                                            }
                                            rows={
                                                props.viewport?.tilePreset
                                                    ?.rows ?? 0
                                            }
                                            processes={props.processes}
                                        />
                                    )}
                                    {props.displayMode?.type ===
                                        DisplayModeType.Float && (
                                        <ViewportAppWindowPreview
                                            processes={props.processes}
                                        />
                                    )}
                                </div>
                            </VirtualFramePreviewBase>
                        </div>
                    }
                />
            </div>
        );
    },
);
