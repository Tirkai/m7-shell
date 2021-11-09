import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { ShellPanelType } from "models/panel/ShellPanelType";
import { ApplicationProcess } from "models/process/ApplicationProcess";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import React from "react";
import { AppWindowContent } from "../AppWindowContent/AppWindowContent";
import { AppWindowUnfocusedOverlay } from "../AppWindowUnfocusedOverlay/AppWindowUnfocusedOverlay";
import style from "./style.module.css";

interface ITransparentWindowProps {
    process: ApplicationProcess;
    window: ApplicationWindow;
    url: string;
}

const className = style.transparentWindow;

export const TransparentWindow = observer((props: ITransparentWindowProps) => {
    const store = useStore();

    return (
        <div className={className}>
            <AppWindowContent
                process={props.process}
                window={props.window}
                url={props.url}
            />
            <AppWindowUnfocusedOverlay
                visible={store.panelManager.activePanel !== ShellPanelType.None}
            />
        </div>
    );
});
