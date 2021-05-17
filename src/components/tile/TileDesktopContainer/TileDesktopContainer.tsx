import classNames from "classnames";
import { DebugPanel } from "components/debug/DebugPanel/DebugPanel";
import { TileWindow } from "components/window/TileWindow/TileWindow";
import { useStore } from "hooks/useStore";
import { get } from "lodash";
import { observer } from "mobx-react";
import { ApplicationProcess } from "models/ApplicationProcess";
import { DesktopEventType } from "models/desktop/DesktopEventType";
import { DisplayModeType } from "models/display/DisplayModeType";
import { TileCell } from "models/tile/TileCell";
import { TilePreset } from "models/tile/TilePreset";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import { ApplicationWindowType } from "models/window/ApplicationWindowType";
import { IApplicationWindow } from "models/window/IApplicationWindow";
import React, { useEffect } from "react";
import { DraggableData, DraggableEvent } from "react-draggable";
import { TileDesktopArea } from "../TileDesktopArea/TileDesktopArea";
import style from "./style.module.css";

interface ITileDesktopContainerProps {
    preset?: TilePreset;
    viewport: VirtualViewportModel;
}

const className = style.tileDesktopContainer;

export const TileDesktopContainer = observer(
    (props: ITileDesktopContainerProps) => {
        const store = useStore();

        const draggedWindow = store.windowManager.draggedWindow;

        const currentViewportPreset =
            store.virtualViewport.currentViewport.tilePreset;

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

        const handleDragStart = (tileWindow: IApplicationWindow) => {
            store.windowManager.startDragWindow(tileWindow);
        };

        const handleDragEnd = (tileWindow: IApplicationWindow) => {
            store.windowManager.stopDragWindow(tileWindow);
        };

        const handleEnter = (tileCell: TileCell) => {
            store.tile.setActiveCell(tileCell);
        };

        const handleDrag = (
            appWindow: IApplicationWindow,
            event: DraggableEvent,
            data: DraggableData,
        ) => {
            appWindow.setPosition(data.x, data.y);
        };

        const handleAreaClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            store.sharedEventBus.eventBus.dispatch(
                DesktopEventType.OnDesktopClick,
            );
        };

        const handleFullscreen = (appWindow: ApplicationWindow) => {
            const displayMode = store.display.findDisplayModeByType(
                DisplayModeType.Tile,
            );
            const template = store.tile.findTileTemplateByAlias("1x1");
            if (displayMode && template && currentViewportPreset) {
                store.tile.detachWindowFromCells(
                    appWindow,
                    currentViewportPreset.cells,
                );

                const viewport = new VirtualViewportModel({
                    displayMode,
                });

                store.virtualViewport.insertViewport(
                    viewport,
                    store.virtualViewport.currentViewport,
                );

                store.tile.applyPresetToViewport(template, viewport);

                store.virtualViewport.applyViewportToWindow(
                    viewport,
                    appWindow,
                );
            }
        };

        const gridStyles = {
            gridTemplateColumns: `repeat(${currentViewportPreset?.columns ??
                0},1fr)`,
            gridTemplateRows: `repeat(${props.preset?.rows ?? 0},1fr)`,
            gridTemplateAreas: props.preset?.areas,
        };

        const processes = store.processManager.processes.filter(
            (process) =>
                (process.window.viewport.id === props.viewport?.id ?? true) &&
                process.window.type === ApplicationWindowType.Tile,
        );

        return currentViewportPreset ? (
            <div className={className}>
                <div
                    className={style.container}
                    style={gridStyles}
                    onClick={handleAreaClick}
                >
                    <DebugPanel show={false}>
                        {props.preset?.cells.map((item) => (
                            <div>
                                CellID: {item.id} WindowID:{" "}
                                {item.attachedAppWindow?.id}
                            </div>
                        ))}
                    </DebugPanel>

                    {props.viewport.displayMode?.enableTileAttach && (
                        <div
                            className={style.floatedArea}
                            style={{
                                ...gridStyles,
                                pointerEvents: draggedWindow ? "all" : "none",
                            }}
                        >
                            {props.preset?.cells.map((cell) => (
                                <TileDesktopArea
                                    key={cell.id}
                                    cell={cell}
                                    onEnter={() => handleEnter(cell)}
                                    active={!!draggedWindow}
                                />
                            ))}
                        </div>
                    )}
                    <div
                        className={classNames(style.appsArea, {
                            [style.single]:
                                (props.preset?.maxTilesCount ?? 0) <= 1,
                        })}
                        style={gridStyles}
                    >
                        {processes.map((process) => (
                            <TileWindow
                                key={process.id}
                                process={process}
                                window={process.window}
                                url={process.modifiedUrl}
                                isFocused={process.window.isFocused}
                                area={process.window.area}
                                onClose={() => handleClose(process)}
                                onDragStart={() =>
                                    handleDragStart(process.window)
                                }
                                onDragEnd={() => handleDragEnd(process.window)}
                                onDrag={(event, data) =>
                                    handleDrag(process.window, event, data)
                                }
                                onFullscreen={
                                    (props.preset?.maxTilesCount ?? 0) > 1
                                        ? () => handleFullscreen(process.window)
                                        : undefined
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

export default TileDesktopContainer;
