import { TransparentWindow } from "components/window/TransparentWindow/TransparentWindow";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { ApplicationProcess } from "models/process/ApplicationProcess";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { ApplicationWindowType } from "models/window/ApplicationWindowType";
import React from "react";
import style from "./style.module.css";

interface ITransparentWindowLayerProps {
    viewport: VirtualViewportModel;
}

const className = style.transparentWindowLayer;

export const TransparentWindowLayer = observer(
    (props: ITransparentWindowLayerProps) => {
        const store = useStore();

        return (
            <div className={className}>
                {store.processManager.processes
                    .filter(
                        (process) =>
                            (process.window.viewport.id ===
                                props.viewport?.id ??
                                true) &&
                            process.window.type ===
                                ApplicationWindowType.Transparent,
                    )
                    .map((process: ApplicationProcess) => {
                        const appWindow = process.window;
                        return (
                            <TransparentWindow
                                key={process.id}
                                process={process}
                                window={appWindow}
                                url={process.modifiedUrl}
                            />
                        );
                    })}
            </div>
        );
    },
);
