import { TileWindow } from "components/window/TileWindow/TileWindow";
import { useStore } from "hooks/useStore";
import { get } from "lodash";
import { observer } from "mobx-react";
import { ApplicationProcess } from "models/ApplicationProcess";
import { TileCell } from "models/tile/TileCell";
import { TilePreset } from "models/tile/TilePreset";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { TileWindowModel } from "models/window/TileWindowModel";
import React, { useEffect } from "react";
import { DraggableData, DraggableEvent } from "react-draggable";
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

        const handleClose = (process: ApplicationProcess) => {
            store.processManager.killProcess(process);
        };

        const handleDragStart = (tileWindow: TileWindowModel) => {
            store.windowManager.startDragWindow(tileWindow);
        };

        const handleDragEnd = (tileWindow: TileWindowModel) => {
            store.windowManager.stopDragWindow(tileWindow);
        };

        const handleEnter = (tileCell: TileCell) => {
            store.tile.setActiveCell(tileCell);
        };

        const handleDrag = (
            appWindow: TileWindowModel,
            event: DraggableEvent,
            data: DraggableData,
        ) => {
            appWindow.setPosition(data.x, data.y);
        };

        const gridStyles = {
            gridTemplateColumns: `repeat(${props.preset.columns},1fr)`,
            gridTemplateRows: `repeat(${props.preset.rows},1fr)`,
            gridTemplateAreas: props.preset.areas,
        };

        return props.preset ? (
            <div className={className}>
                <div className={style.container} style={gridStyles}>
                    <div
                        className={style.floatedArea}
                        style={{
                            ...gridStyles,
                            pointerEvents: draggedWindow ? "all" : "none",
                        }}
                    >
                        {props.preset.cells.map((cell) => (
                            <TileDesktopArea
                                key={cell.id}
                                cell={cell}
                                onEnter={() => handleEnter(cell)}
                                active={!!draggedWindow}
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
                                    window={process.window as TileWindowModel}
                                    url={process.modifiedUrl}
                                    isFocused={process.window.isFocused}
                                    area={
                                        (process.window as TileWindowModel).area
                                    }
                                    onClose={() => handleClose(process)}
                                    onDragStart={() =>
                                        handleDragStart(
                                            process.window as TileWindowModel,
                                        )
                                    }
                                    onDragEnd={() =>
                                        handleDragEnd(
                                            process.window as TileWindowModel,
                                        )
                                    }
                                    onDrag={(event, data) =>
                                        handleDrag(
                                            process.window as TileWindowModel,
                                            event,
                                            data,
                                        )
                                    }
                                    x={process.window.x}
                                    y={process.window.y}
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
