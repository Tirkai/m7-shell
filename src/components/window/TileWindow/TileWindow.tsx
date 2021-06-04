import { ConfigCondition } from "components/config/ConfigCondition/ConfigCondition";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { ApplicationProcess } from "models/ApplicationProcess";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import React, { useState } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";
import AppLoader from "../AppLoader/AppLoader";
import { AppWindowContent } from "../AppWindowContent/AppWindowContent";
import { AppWindowHeader } from "../AppWindowHeader/AppWindowHeader";
import { AppWindowUnfocusedOverlay } from "../AppWindowUnfocusedOverlay/AppWindowUnfocusedOverlay";
import style from "./style.module.css";

interface ITileWindowProps {
    process: ApplicationProcess;
    window: ApplicationWindow;
    isFocused: boolean;
    x: number;
    y: number;
    onDragStart: () => void;
    onDragEnd: () => void;
    onClose: (appWindow: ApplicationWindow) => void;
    onDrag: DraggableEventHandler;
    onFullscreen?: () => void;
    url: string;
    area: string;
}

const className = style.tileWindow;

export const TileWindow = observer((props: ITileWindowProps) => {
    const [isAppReady, setAppReady] = useState(false);
    const store = useStore();

    const handleAppReady = () => {
        setAppReady(true);
    };

    const gridStyle = {
        gridArea: props.area,
    };

    const handleFocus = (tileWindow: ApplicationWindow) => {
        store.windowManager.focusWindow(tileWindow);
    };

    const { config } = store.config;

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
                <ConfigCondition
                    condition={config["windows.singleWindow.header.enabled"]}
                >
                    <AppWindowHeader
                        icon={props.process.app.icon}
                        title={props.process.app.name}
                        isFocused={props.isFocused}
                        onFullscreen={props.onFullscreen}
                        onClose={() => props.onClose(props.window)}
                        visible
                    />
                </ConfigCondition>

                <AppLoader
                    icon={props.process.app.icon}
                    disabled={isAppReady}
                />
                <AppWindowContent
                    process={props.process}
                    window={props.window}
                    url={props.url}
                    onReady={() => handleAppReady()}
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
