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
    onReplaceWindow?: (
        attachedWindow: ApplicationWindow,
        targetWindow: ApplicationWindow,
        tileBounds: DOMRect,
    ) => void;
    onAttachWindow?: (
        appWindow: ApplicationWindow,
        tileBounds: DOMRect,
    ) => void;
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

            // Detach window after drag and drop
            if (props.draggedWindow.id === props.cell.attachedAppWindow?.id) {
                props.cell.setAttachedAppWindow(null);
            }

            const listener = props.cell.draggedAppWindow?.eventTarget.add<
                ApplicationWindow
            >(ApplicationWindowEventType.OnDragChange, (appWindow) => {
                // Trigger event when dragging window is dropped
                if (!appWindow.isDragging) {
                    const tileBounds = ref.current?.getBoundingClientRect();
                    // Check exist tile area bounds
                    if (tileBounds) {
                        if (!props.cell.hasAttachedWindow) {
                            if (
                                props.onAttachWindow &&
                                props.cell.draggedAppWindow
                            ) {
                                props.onAttachWindow(
                                    props.cell.draggedAppWindow,
                                    tileBounds,
                                );
                            }
                        } else {
                            if (
                                props.onReplaceWindow &&
                                props.cell.attachedAppWindow &&
                                props.cell.draggedAppWindow
                            ) {
                                props.onReplaceWindow(
                                    props.cell.attachedAppWindow,
                                    props.cell.draggedAppWindow,
                                    tileBounds,
                                );
                            }
                            // if (props.onReplaceWindow && w) {
                            //     props.onReplaceWindow(w);
                            // }
                            // props.cell.draggedAppWindow?.setSize(
                            //     tileBounds.width,
                            //     tileBounds.height,
                            // );
                            // props.cell.draggedAppWindow?.setPosition(
                            //     tileBounds.x,
                            //     tileBounds.y,
                            // );
                            // props.cell.setAttachedAppWindow(appWindow);
                        }
                    }

                    // if (props.hasAttachedWindow) {
                    //     const cellAttachedWindow = props.cell.attachedAppWindow;
                    //     if (cellAttachedWindow) {
                    //         props.cell.setAttachedAppWindow(null);
                    //         props.cell.setAttachedAppWindow(appWindow);

                    //         // alert("DRAG_STOP_ATTACHED_AREA");
                    //     }
                    // }
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
            {/* <div className={style.debug}>
                <div>
                    Attached: {JSON.stringify(props.cell.attachedAppWindow)}
                </div>
                <div>
                    Dragged: {JSON.stringify(props.cell.draggedAppWindow)}
                </div>
            </div> */}
            {props.hasDraggedWindow && !props.hasAttachedWindow && (
                <LayerBoxVisualizer />
            )}
        </div>
    );
};
