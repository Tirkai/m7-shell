import { IconButton } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import classNames from "classnames";
import { DisplayModeChooser } from "components/tile/DisplayModeChooser/DisplayModeChooser";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { DisplayMode } from "models/display/DisplayMode";
import { TileTemplate } from "models/tile/TileTemplate";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import React from "react";
import style from "./style.module.css";

interface IVirtualFramePreviewProps {
    onClick?: () => void;
    onDelete?: () => void;
    active: boolean;
    children: React.ReactNode;
    viewport?: VirtualViewportModel;
    hasControls?: boolean;
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
            }
        };

        const handleApplyDisplayMode = (displayMode: DisplayMode) => {
            const viewport = props.viewport;
            if (viewport) {
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
                <div className={style.header}>
                    {props.hasControls && (
                        <>
                            <div className={style.indicator}>
                                <DisplayModeChooser
                                    displayMode={props.viewport?.displayMode}
                                    presetAlias={
                                        props.viewport?.tilePreset.alias
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
                        </>
                    )}
                </div>
                <div
                    className={classNames(style.container)}
                    onClick={props.onClick}
                >
                    <div
                        className={classNames(style.content, {
                            [style.active]: props.active,
                        })}
                    >
                        {props.children}
                    </div>
                </div>
            </div>
        );
    },
);
