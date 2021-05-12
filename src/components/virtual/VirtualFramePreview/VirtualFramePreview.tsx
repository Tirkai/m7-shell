import { IconButton } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import classNames from "classnames";
import { DisplayModeChooseItem } from "components/display/DisplayModeChooseItem/DisplayModeChooseItem";
import { DisplayModeChooser } from "components/tile/DisplayModeChooser/DisplayModeChooser";
import { TileChooserItem } from "components/tile/TileChooserItem/TileChooserItem";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { DisplayMode } from "models/display/DisplayMode";
import { TilePreset } from "models/tile/TilePreset";
import { TileTemplate } from "models/tile/TileTemplate";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { ApplicationWindowType } from "models/window/ApplicationWindowType";
import { FloatWindowStrategy } from "models/window/FloatWindowStrategy";
import { TileWindowStrategy } from "models/window/TileWindowStrategy";
import React, { useState } from "react";
import style from "./style.module.css";

interface IVirtualFramePreviewProps {
    onClick?: () => void;
    onDelete?: () => void;
    active: boolean;
    children: React.ReactNode;
    templates?: TileTemplate[];
    preset?: TilePreset;
    viewport?: VirtualViewportModel;
    hideDeleteControl?: boolean;
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

        const currentActiveTemplate = props.templates?.find(
            (item) => item.alias === props.preset?.alias,
        );

        const [isShowDisplayModeChooser, setShowDisplayModeChooser] = useState(
            false,
        );

        const handleApplyPreset = (
            template: TileTemplate,
            viewport?: VirtualViewportModel,
        ) => {
            if (template && viewport) {
                store.display.applyDisplayModeToViewport(
                    new DisplayMode({
                        windowStrategy: new TileWindowStrategy({ viewport }),
                        enableTileAttachArea: true,
                    }),
                    viewport,
                );

                store.tile.applyPresetToViewport(template, viewport);

                store.processManager.processes
                    .filter((item) => item.window.viewport.id === viewport.id)
                    .forEach((item) => {
                        store.windowManager.applyTypeToWindow(
                            item.window,
                            ApplicationWindowType.Tile,
                        );
                    });

                setShowDisplayModeChooser(false);
            }
        };

        const handleApplyFloatedDisplayMode = (
            viewport?: VirtualViewportModel,
        ) => {
            if (viewport) {
                store.display.applyDisplayModeToViewport(
                    new DisplayMode({
                        windowStrategy: new FloatWindowStrategy({ viewport }),
                    }),
                    viewport,
                );
                store.processManager.processes
                    .filter((item) => item.window.viewport.id === viewport.id)
                    .forEach((item) => {
                        store.windowManager.applyTypeToWindow(
                            item.window,
                            ApplicationWindowType.Float,
                        );
                    });

                setShowDisplayModeChooser(false);
            }
        };

        return (
            <div className={classNames(className)}>
                <div className={style.actions}>
                    {currentActiveTemplate && (
                        <>
                            <div className={style.tileChooseIndicator}>
                                <DisplayModeChooseItem>
                                    <TileChooserItem
                                        template={
                                            // TODO: Убрать этот лютейший костыль, ибо сейчас я слишком устал, что сделать нормально
                                            props.viewport?.displayMode
                                                .enableTileAttach
                                                ? currentActiveTemplate
                                                : undefined
                                        }
                                        active={isShowDisplayModeChooser}
                                        onClick={() =>
                                            setShowDisplayModeChooser(true)
                                        }
                                    />
                                </DisplayModeChooseItem>
                            </div>
                            {!props.hideDeleteControl && (
                                <IconButton
                                    size="small"
                                    color="secondary"
                                    onClick={handleDelete}
                                >
                                    <Clear />
                                </IconButton>
                            )}
                        </>
                    )}
                    <DisplayModeChooser
                        show={isShowDisplayModeChooser}
                        templates={
                            props.templates?.filter(
                                (template) =>
                                    template.alias !==
                                    props.viewport?.tilePreset.alias,
                            ) ?? []
                        }
                        onApplyTileDisplayMode={(template) =>
                            handleApplyPreset(template, props.viewport)
                        }
                        onApplyFloatedDisplayMode={() =>
                            handleApplyFloatedDisplayMode(props.viewport)
                        }
                    />
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
