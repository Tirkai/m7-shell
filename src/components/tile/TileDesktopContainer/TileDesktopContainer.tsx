import { useStore } from "hooks/useStore";
import { get } from "lodash";
import { observer } from "mobx-react";
import { ApplicationWindow } from "models/ApplicationWindow";
import { TileCell } from "models/tile/TileCell";
import React, { useEffect } from "react";
import { TileDesktopArea } from "../TileDesktopArea/TileDesktopArea";
import style from "./style.module.css";

const className = style.tileDesktopContainer;

export const TileDesktopContainer = observer(() => {
    const store = useStore();

    const activePreset = store.tile.activePreset;

    const draggedWindow = store.windowManager.draggedWindow;

    useEffect(() => {
        if (activePreset) {
            const slicedWindows = store.windowManager.windows.filter(
                (item) => !item.isCollapsed && !item.isFullScreen,
            );
            store.tile.activePreset?.cells.forEach((item, index) => {
                const indexedWindow = get(slicedWindows, index);
                if (indexedWindow) {
                    store.tile.attachWindowToTileCell(indexedWindow, item);
                }
            });
        }
    }, [activePreset]);

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
        const freeCell = store.tile.nearbyFreeCell;
        if (freeCell) {
            cell.setAttachedAppWindow(null);

            store.tile.attachWindowToTileCell(attachedWindow, freeCell);

            attachedWindow.setSize(freeCell.width, freeCell.height);
            attachedWindow.setPosition(freeCell.x, freeCell.y);

            store.tile.attachWindowToTileCell(targetWindow, cell);
        }
    };

    return activePreset ? (
        <div className={className}>
            <div
                className={style.container}
                style={{
                    gridTemplateColumns: `repeat(${activePreset.columns},1fr)`,
                    gridTemplateRows: `repeat(${activePreset.rows},1fr)`,
                }}
            >
                {activePreset.cells.map((cell) => (
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
});
