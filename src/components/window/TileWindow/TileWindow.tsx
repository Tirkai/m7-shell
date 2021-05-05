import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { ApplicationProcess } from "models/ApplicationProcess";
import { TileWindowModel } from "models/window/TileWindowModel";
import React, { useState } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";
import AppLoader from "../AppLoader/AppLoader";
import { AppWindowContent } from "../AppWindowContent/AppWindowContent";
import { AppWindowHeader } from "../AppWindowHeader/AppWindowHeader";
import { AppWindowUnfocusedOverlay } from "../AppWindowUnfocusedOverlay/AppWindowUnfocusedOverlay";
import style from "./style.module.css";

interface ITileWindowProps {
    process: ApplicationProcess;
    window: TileWindowModel;
    isFocused: boolean;
    x: number;
    y: number;
    onDragStart: () => void;
    onDragEnd: () => void;
    onClose: (appWindow: TileWindowModel) => void;
    onDrag: DraggableEventHandler;
    url: string;
    area: string;
}

const className = style.tileWindow;

export const TileWindow = observer((props: ITileWindowProps) => {
    const [isAppReady, setAppReady] = useState(false);
    const store = useStore();

    const gridStyle = {
        gridArea: props.area,
    };

    const handleFocus = (tileWindow: TileWindowModel) => {
        store.windowManager.focusWindow(tileWindow);
    };

    return (
        <Draggable
            handle=".appHeaderInfoBar"
            onMouseDown={() => handleFocus(props.window)}
            onStart={() => props.onDragStart()}
            onStop={() => props.onDragEnd()}
            position={{
                x: props.x,
                y: props.y,
            }}
        >
            <div
                className={className}
                style={{ ...gridStyle, zIndex: props.window.depthIndex }}
            >
                <AppWindowHeader
                    icon={props.process.app.icon}
                    title={props.process.app.name}
                    isFocused={props.isFocused}
                    onClose={() => props.onClose(props.window)}
                    visible
                />
                <AppLoader
                    icon={props.process.app.icon}
                    disabled={isAppReady}
                />
                <AppWindowContent
                    process={props.process}
                    window={props.window}
                    url={props.url}
                    onReady={() => setAppReady(true)}
                />
                <AppWindowUnfocusedOverlay
                    visible={
                        store.windowManager.hasDraggedWindow ||
                        !props.window.isFocused
                    }
                />
            </div>
        </Draggable>
    );
});
