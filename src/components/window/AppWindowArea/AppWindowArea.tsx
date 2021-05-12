import classNames from "classnames";
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH } from "constants/config";
import { ResizeHandleDirection } from "enum/ResizeHandleDirection";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { ApplicationProcess } from "models/ApplicationProcess";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import { ApplicationWindowType } from "models/window/ApplicationWindowType";
import React from "react";
import { DraggableData, DraggableEvent } from "react-draggable";
import { ResizeCallbackData } from "react-resizable";
import { AppWindow } from "../AppWindow/AppWindow";
import style from "./style.module.css";

interface IAppWindowAreaProps {
    disabled?: boolean;
    viewport?: VirtualViewportModel;
}

export const AppWindowArea = observer((props: IAppWindowAreaProps) => {
    const store = useStore();

    const handleWindowResizeStart = (
        appWindow: ApplicationWindow,
        event: MouseEvent,
        data: ResizeCallbackData,
    ) => {
        appWindow.setResizing(true);
        appWindow.setResizeOriginPoint(event.clientX, event.clientY);
    };

    const handleWindowResize = (
        appWindow: ApplicationWindow,
        event: MouseEvent,
        data: ResizeCallbackData,
    ) => {
        const size = data.size;
        let position = { x: event.clientX, y: event.clientY };

        if (
            data.handle === ResizeHandleDirection.NorthEast ||
            data.handle === ResizeHandleDirection.NorthWest ||
            data.handle === ResizeHandleDirection.SouthEast ||
            data.handle === ResizeHandleDirection.SouthWest
        ) {
            if (
                appWindow.width < MIN_WINDOW_WIDTH ||
                appWindow.height < MIN_WINDOW_HEIGHT
            ) {
                position = {
                    x: appWindow.minXPosition,
                    y: appWindow.minYPosition,
                };
                event.preventDefault();
            }
        } else {
            if (appWindow.width < MIN_WINDOW_WIDTH) {
                position = {
                    x: appWindow.minXPosition,
                    y: event.clientY,
                };
            }
            if (appWindow.height < MIN_WINDOW_HEIGHT) {
                position = {
                    x: event.clientX,
                    y: appWindow.minYPosition,
                };
            }
        }

        appWindow.resize(data.handle, position, size);
    };

    const handleCloseWindow = (appProcess: ApplicationProcess) => {
        store.processManager.killProcess(appProcess);
    };

    const handleDrag = (
        appWindow: ApplicationWindow,
        event: DraggableEvent,
        data: DraggableData,
    ) => {
        appWindow.setPosition(data.x, data.y);
    };

    return (
        <div
            className={classNames(style.appWindowArea, {
                [style.disabled]: props.disabled,
            })}
        >
            {store.processManager.processes
                .filter(
                    (process) =>
                        (process.window.viewport.id === props.viewport?.id ??
                            true) &&
                        process.window.type === ApplicationWindowType.Float,
                )
                .map((process: ApplicationProcess) => {
                    const appWindow = process.window as ApplicationWindow;

                    return (
                        <AppWindow
                            key={process.window.id}
                            process={process}
                            url={process.modifiedUrl}
                            {...process.window}
                            window={appWindow}
                            onResizeStart={(event, data) =>
                                handleWindowResizeStart(appWindow, event, data)
                            }
                            onResizeStop={() => appWindow.setResizing(false)}
                            onResize={(event, data) =>
                                handleWindowResize(appWindow, event, data)
                            }
                            onDragStart={() => appWindow.setDragging(true)}
                            onDragStop={() => appWindow.setDragging(false)}
                            onDrag={(event, data) =>
                                handleDrag(appWindow, event, data)
                            }
                            onClose={() => handleCloseWindow(process)}
                            isResizing={appWindow.isResizing}
                            isDragging={appWindow.isDragging}
                            width={appWindow.width}
                            height={appWindow.height}
                        />
                    );
                })}
        </div>
    );
});
