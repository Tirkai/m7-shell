import { TileCell } from "models/tile/TileCell";
import { IApplicationWindow } from "models/window/IApplicationWindow";
import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.css";

interface ITileDesktopAreaProps {
    cell: TileCell;
    draggedWindow?: IApplicationWindow;
    hasDraggedWindow: boolean;
    hasAttachedWindow: boolean;
    onReplaceWindow?: (
        attachedWindow: IApplicationWindow,
        targetWindow: IApplicationWindow,
        tileBounds: DOMRect,
    ) => void;
    onAttachWindow?: (
        appWindow: IApplicationWindow,
        tileBounds: DOMRect,
    ) => void;
    children?: React.ReactNode;
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

            // TODO : Think about it
            // TODO: FIX
            // const listener = props.cell.draggedAppWindow?.eventTarget.add(
            //     ApplicationWindowEventType.OnDragChange,
            //     (appWindow: ApplicationWindow) => {
            //         // Trigger event when dragging window is dropped
            //         if (!appWindow.isDragging) {
            //             const tileBounds = ref.current?.getBoundingClientRect();
            //             // Check exist tile area bounds
            //             if (tileBounds) {
            //                 if (!props.cell.hasAttachedWindow) {
            //                     if (
            //                         props.onAttachWindow &&
            //                         props.cell.draggedAppWindow
            //                     ) {
            //                         props.onAttachWindow(
            //                             props.cell.draggedAppWindow,
            //                             tileBounds,
            //                         );
            //                     }
            //                 } else {
            //                     if (
            //                         props.onReplaceWindow &&
            //                         props.cell.attachedAppWindow &&
            //                         props.cell.draggedAppWindow
            //                     ) {
            //                         props.onReplaceWindow(
            //                             props.cell.attachedAppWindow,
            //                             props.cell.draggedAppWindow,
            //                             tileBounds,
            //                         );
            //                     }
            //                 }
            //             }
            //         }
            //     },
            // );
            // if (listener) {
            //     setEventListener(listener);
            // }
        }
    };

    const handleExit = () => {
        // if (eventListener) {
        //     props.cell.draggedAppWindow?.eventTarget.remove(eventListener.id);
        // }

        props.cell.setDraggedAppWindow(null);
    };

    return (
        <div
            className={className}
            onMouseEnter={handleEnter}
            onMouseLeave={handleExit}
            style={{
                gridRow: `${props.cell.startRow}/${props.cell.endRow}`,
                gridColumn: `${props.cell.startColumn}/${props.cell.endColumn}`,
            }}
        >
            {/* <div className={style.debug}>
                ATTACHED: {JSON.stringify(props.cell.attachedAppWindow)}
                <br />
                DRAGGED: {JSON.stringify(props.cell.draggedAppWindow)}
            </div> */}
            <div className={style.container} ref={ref}>
                {props.children}
                {/* {props.hasDraggedWindow && <LayerBoxVisualizer />} */}
            </div>
        </div>
    );
};
