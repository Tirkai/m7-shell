import { LayerBoxVisualizer } from "components/debug/LayerBoxVisualizer/LayerBoxVisualizer";
import { ApplicationWindow } from "models/ApplicationWindow";
import { TileCell } from "models/tile/TileCell";
import { ApplicationWindowEventType } from "models/window/ApplicationWindowEventType";
import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.css";

interface ITileDesktopAreaProps {
    cell: TileCell;
    draggedWindow?: ApplicationWindow;
    hasDraggedWindow: boolean;
    hasAttachedWindow: boolean;
}

const className = style.tileDesktopArea;

export const TileDesktopArea = (props: ITileDesktopAreaProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [eventListener, setEventListener] = useState<{ id: string } | null>(
        null,
    );

    const handleResize = () => {
        const bounds = ref.current?.getBoundingClientRect();
        if (bounds) {
            props.cell.setSize(bounds.width, bounds.height);
            props.cell.setPosition(bounds.x, bounds.y);
        }
    };

    useEffect(() => {
        const listener = () => handleResize();
        window.addEventListener("resize", listener);
        return () => {
            window.removeEventListener("resize", listener);
        };
    }, []);

    useEffect(() => {
        const bounds = ref.current?.getBoundingClientRect();
        if (bounds) {
            props.cell.setSize(bounds.width, bounds.height);
            props.cell.setPosition(bounds.x, bounds.y);
        }
    }, [ref.current]);

    const handleEnter = () => {
        if (props.draggedWindow) {
            props.cell.setDraggedAppWindow(props.draggedWindow);

            if (props.draggedWindow.id === props.cell.attachedAppWindow?.id) {
                props.cell.setAttachedAppWindow(null);
            }

            const listener = props.cell.draggedAppWindow?.eventTarget.add<
                ApplicationWindow
            >(ApplicationWindowEventType.OnDragChange, (appWindow) => {
                if (!appWindow.isDragging) {
                    const tileBounds = ref.current?.getBoundingClientRect();
                    if (tileBounds) {
                        if (!props.cell.hasAttachedWindow) {
                            props.cell.draggedAppWindow?.setSize(
                                tileBounds.width,
                                tileBounds.height,
                            );
                            props.cell.draggedAppWindow?.setPosition(
                                tileBounds.x,
                                tileBounds.y,
                            );
                            props.cell.setAttachedAppWindow(appWindow);
                        }
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
            props.cell.draggedAppWindow?.eventTarget.remove(eventListener.id);
        }

        // console.log(props.draggedWindow);

        // if (props.draggedWindow && props.cell.attachedAppWindow) {
        //     console.log("Detached");
        //     props.cell.setAttachedAppWindow(null);
        // }

        props.cell.setDraggedAppWindow(null);
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
            <div className={style.debug}>
                <div>ID: {props.cell.id}</div>
                <div>
                    Dragged: {JSON.stringify(props.cell.draggedAppWindow)}
                </div>
                <div>
                    Attached: {JSON.stringify(props.cell.attachedAppWindow)}
                </div>
            </div>
            {props.hasDraggedWindow && !props.hasAttachedWindow && (
                <LayerBoxVisualizer />
            )}
        </div>
    );
};
