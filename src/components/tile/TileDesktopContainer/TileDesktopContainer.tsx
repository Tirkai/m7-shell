import { useStore } from "hooks/useStore";
import { get } from "lodash";
import { observer } from "mobx-react";
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
                    />
                ))}
            </div>
        </div>
    ) : (
        <></>
    );
});
