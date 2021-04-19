import { LayerBoxVisualizer } from "components/debug/LayerBoxVisualizer/LayerBoxVisualizer";
import { ApplicationWindow } from "models/ApplicationWindow";
import { TileCell } from "models/tile/TileCell";
import { ApplicationWindowEventType } from "models/window/ApplicationWindowEventType";
import React, { useRef, useState } from "react";
import style from "./style.module.css";

interface ITileDesktopAreaProps {
    // tile: TileArea;
    cell: TileCell;
    draggedWindow?: ApplicationWindow;
    hasWindow: boolean;
}

const className = style.tileDesktopArea;

export const TileDesktopArea = (props: ITileDesktopAreaProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [eventListener, setEventListener] = useState<{ id: string } | null>(
        null,
    );
    const handleEnter = () => {
        if (props.draggedWindow) {
            props.cell.setAppWindow(props.draggedWindow);
            const listener = props.cell.appWindow?.eventTarget.add<
                ApplicationWindow
            >(ApplicationWindowEventType.OnDragChange, (appWindow) => {
                if (!appWindow.isDragging) {
                    const tileBounds = ref.current?.getBoundingClientRect();
                    if (tileBounds) {
                        props.cell.appWindow?.setSize(
                            tileBounds.width,
                            tileBounds.height,
                        );
                        props.cell.appWindow?.setPosition(
                            tileBounds.x,
                            tileBounds.y,
                        );
                    }
                }
            });
            if (listener) {
                setEventListener(listener);
            }
        }
    };

    const handleExit = () => {
        if (eventListener) {
            props.cell.appWindow?.eventTarget.remove(eventListener.id);
        }

        props.cell.setAppWindow(null);
    };

    return (
        <div
            className={className}
            ref={ref}
            onMouseEnter={handleEnter}
            onMouseLeave={handleExit}
            style={{
                gridRow: `${props.cell.startRow}/${props.cell.endRow}`,
                gridColumn: `${props.cell.startColumn}/${props.cell.endColumn}`,
            }}
        >
            {props.hasWindow && (
                <LayerBoxVisualizer>
                    {/* {JSON.stringify(props.tile.appWindow)} */}
                </LayerBoxVisualizer>
            )}
        </div>
    );
};
