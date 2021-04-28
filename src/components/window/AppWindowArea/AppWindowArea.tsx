import classNames from "classnames";
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH } from "constants/config";
import { ResizeHandleDirection } from "enum/ResizeHandleDirection";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { ApplicationProcess } from "models/ApplicationProcess";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { ApplicationWindow } from "models/window/ApplicationWindow";
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
                        process.viewport?.id === props.viewport?.id ?? true,
                )
                .map((process: ApplicationProcess) => (
                    <AppWindow
                        key={process.window.id}
                        process={process}
                        url={process.modifiedUrl}
                        {...process.window}
                        window={process.window}
                        onResizeStart={(event, data) =>
                            handleWindowResizeStart(process.window, event, data)
                        }
                        onResizeStop={() => process.window.setResizing(false)}
                        onResize={(event, data) =>
                            handleWindowResize(process.window, event, data)
                        }
                        onDragStart={() => process.window.setDragging(true)}
                        onDragStop={() => process.window.setDragging(false)}
                        onDrag={(event, data) =>
                            handleDrag(process.window, event, data)
                        }
                        onClose={() => handleCloseWindow(process)}
                    />
                ))}
        </div>
    );
});
