import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import React from "react";
import { TileDesktopArea } from "../TileDesktopArea/TileDesktopArea";
import style from "./style.module.css";

const className = style.tileDesktopContainer;

export const TileDesktopContainer = observer(() => {
    const store = useStore();

    const activePreset = store.tile.activePreset;

    const draggedWindow = store.windowManager.draggedWindow;

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
                        hasWindow={cell.hasWindow}
                    />
                ))}
            </div>
        </div>
    ) : (
        <></>
    );
});
