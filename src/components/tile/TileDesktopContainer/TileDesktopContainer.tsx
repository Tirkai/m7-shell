import { useStore } from "hooks/useStore";
import { get } from "lodash";
import { observer } from "mobx-react";
import { TileCell } from "models/tile/TileCell";
import { TilePreset } from "models/tile/TilePreset";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import React, { useEffect } from "react";
import { TileDesktopArea } from "../TileDesktopArea/TileDesktopArea";
import style from "./style.module.css";

interface ITileDesktopContainerProps {
    preset?: TilePreset;
}

const className = style.tileDesktopContainer;

export const TileDesktopContainer = observer(
    (props: ITileDesktopContainerProps) => {
        const store = useStore();

        const draggedWindow = store.windowManager.draggedWindow;

        useEffect(() => {
            const preset = props.preset;
            if (preset) {
                const sw = store.processManager.processes
                    .filter(
                        (process) =>
                            process.viewport?.id ===
                            store.virtualViewport.currentViewport.id,
                    )
                    .map((process) => process.window)
                    .filter(
                        (appWindow) =>
                            !appWindow.isCollapsed && !appWindow.isFullScreen,
                    );
                preset.cells.forEach((item, index) => {
                    const indexedWindow = get(sw, index);
                    if (indexedWindow) {
                        store.tile.attachWindowToCell(
                            indexedWindow,
                            preset,
                            item,
                        );
                    }
                });
            }
        }, [props.preset]);

        const handleAttach = (
            cell: TileCell,
            appWindow: ApplicationWindow,
            tileBounds: DOMRect,
        ) => {
            cell.draggedAppWindow?.setSize(tileBounds.width, tileBounds.height);
            cell.draggedAppWindow?.setPosition(tileBounds.x, tileBounds.y);
            cell.setAttachedAppWindow(appWindow);
        };

        const handleReplace = (
            cell: TileCell,
            attachedWindow: ApplicationWindow,
            targetWindow: ApplicationWindow,
            tileBounds: DOMRect,
        ) => {
            const preset = props.preset;
            if (preset) {
                const freeCell = preset.nearbyFreeCell;
                if (freeCell) {
                    store.tile.detachWindowFromCell(cell);

                    store.tile.attachWindowToCell(
                        attachedWindow,
                        preset,
                        freeCell,
                    );

                    attachedWindow.setSize(freeCell.width, freeCell.height);
                    attachedWindow.setPosition(freeCell.x, freeCell.y);

                    store.tile.attachWindowToCell(targetWindow, preset, cell);
                }
            }
        };

        return props.preset ? (
            <div className={className}>
                <div
                    className={style.container}
                    style={{
                        gridTemplateColumns: `repeat(${props.preset.columns},1fr)`,
                        gridTemplateRows: `repeat(${props.preset.rows},1fr)`,
                    }}
                >
                    {props.preset.cells.map((cell) => (
                        <TileDesktopArea
                            key={cell.id}
                            cell={cell}
                            draggedWindow={draggedWindow}
                            hasDraggedWindow={cell.hasDraggedWindow}
                            hasAttachedWindow={cell.hasAttachedWindow}
                            onReplaceWindow={(
                                attachedAppWindow,
                                targetWindow,
                                tileBounds,
                            ) =>
                                handleReplace(
                                    cell,
                                    attachedAppWindow,
                                    targetWindow,
                                    tileBounds,
                                )
                            }
                            onAttachWindow={(appWindow, tileBounds) =>
                                handleAttach(cell, appWindow, tileBounds)
                            }
                        />
                    ))}
                </div>
            </div>
        ) : (
            <></>
        );
    },
);
