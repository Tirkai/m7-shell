import { TileWindow } from "components/window/TileWindow/TileWindow";
import { useStore } from "hooks/useStore";
import { get } from "lodash";
import { observer } from "mobx-react";
import { TileCell } from "models/tile/TileCell";
import { TilePreset } from "models/tile/TilePreset";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { IApplicationWindow } from "models/window/IApplicationWindow";
import { TileWindowModel } from "models/window/TileWindowModel";
import React, { useEffect } from "react";
import { TileDesktopArea } from "../TileDesktopArea/TileDesktopArea";
import style from "./style.module.css";

interface ITileDesktopContainerProps {
    preset: TilePreset;
    viewport: VirtualViewportModel;
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
                            process.window.viewport.id ===
                            store.virtualViewport.currentViewport.id,
                    )
                    .map((process) => process.window);
                // .filter(
                //     (appWindow) =>
                //         !appWindow.isCollapsed && !appWindow.isFullScreen,
                // );
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
            appWindow: IApplicationWindow,
            tileBounds: DOMRect,
        ) => {
            // TODO: Fix
            // cell.draggedAppWindow?.setSize(tileBounds.width, tileBounds.height);
            // cell.draggedAppWindow?.setPosition(tileBounds.x, tileBounds.y);
            cell.setAttachedAppWindow(appWindow);
        };

        const handleReplace = (
            cell: TileCell,
            attachedWindow: IApplicationWindow,
            targetWindow: IApplicationWindow,
            tileBounds: DOMRect,
        ) => {
            const preset = props.preset;
            if (preset) {
                const freeCell = preset.nearbyFreeCell;
                if (freeCell) {
                    // store.tile.detachWindowFromCell(cell);

                    store.tile.attachWindowToCell(
                        attachedWindow,
                        preset,
                        freeCell,
                    );

                    // TODO: Fix

                    // attachedWindow.setSize(freeCell.width, freeCell.height);
                    // attachedWindow.setPosition(freeCell.x, freeCell.y);

                    // store.tile.attachWindowToCell(targetWindow, preset, cell);
                }
            }
        };

        const gridStyles = {
            gridTemplateColumns: `repeat(${props.preset.columns},1fr)`,
            gridTemplateRows: `repeat(${props.preset.rows},1fr)`,
        };

        return props.preset ? (
            <div className={className}>
                <div className={style.container} style={gridStyles}>
                    <div
                        className={style.floatedArea}
                        style={{ ...gridStyles, pointerEvents: "none" }}
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
                    <div className={style.appsArea} style={gridStyles}>
                        {store.processManager.processes
                            .filter(
                                (process) =>
                                    (process.window.viewport.id ===
                                        props.viewport?.id ??
                                        true) &&
                                    process.window instanceof TileWindowModel,
                            )
                            .map((process) => (
                                <TileWindow
                                    key={process.id}
                                    process={process}
                                    window={process.window}
                                    url={process.modifiedUrl}
                                    startColumn={
                                        (process.window as TileWindowModel)
                                            .startColumn
                                    }
                                    endColumn={
                                        (process.window as TileWindowModel)
                                            .endColumn
                                    }
                                    startRow={
                                        (process.window as TileWindowModel)
                                            .startRow
                                    }
                                    endRow={
                                        (process.window as TileWindowModel)
                                            .endRow
                                    }
                                />
                            ))}
                    </div>
                </div>
            </div>
        ) : (
            <></>
        );
    },
);
