import { IconButton } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import classNames from "classnames";
import { TileChooserItem } from "components/tile/TileChooserItem/TileChooserItem";
import { TilePresetChooser } from "components/tile/TilePresetChooser/TilePresetChooser";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { TilePreset } from "models/tile/TilePreset";
import { TileTemplate } from "models/tile/TileTemplate";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
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

        const [isShowTileGridChooser, setShowTileGridChooser] = useState(false);

        const handleApplyPreset = (
            template: TileTemplate,
            viewport?: VirtualViewportModel,
        ) => {
            if (template && viewport) {
                store.tile.applyPresetToViewport(template, viewport);
                setShowTileGridChooser(false);
            }
        };

        return (
            <div className={classNames(className)}>
                <div className={style.actions}>
                    {currentActiveTemplate && (
                        <>
                            <TileChooserItem
                                template={currentActiveTemplate}
                                active={false}
                                onClick={() => setShowTileGridChooser(true)}
                            />

                            <IconButton
                                size="small"
                                color="secondary"
                                onClick={handleDelete}
                            >
                                <Clear />
                            </IconButton>
                        </>
                    )}
                    <TilePresetChooser
                        show={isShowTileGridChooser}
                        templates={props.templates ?? []}
                        onApply={(template) =>
                            handleApplyPreset(template, props.viewport)
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
