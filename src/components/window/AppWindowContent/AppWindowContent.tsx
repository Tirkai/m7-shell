import { AppMessageType } from "@algont/m7-shell-emitter";
import classNames from "classnames";
import { useStore } from "hooks/useStore";
import { IStore } from "interfaces/common/IStore";
import { observer } from "mobx-react";
import { ApplicationProcess } from "models/ApplicationProcess";
import { ExternalApplication } from "models/ExternalApplication";
import { ShellApplication } from "models/ShellApplication";
import { IApplicationWindow } from "models/window/IApplicationWindow";
import React, { useEffect, useMemo, useState } from "react";
import style from "./style.module.css";

interface IAppWindowProps extends IStore {
    process: ApplicationProcess;
    window: IApplicationWindow;
    url: string;
    onReady?: () => void;
}

export const AppWindowContent = observer((props: IAppWindowProps) => {
    const store = useStore();
    const [isAppReady, setAppReady] = useState(false);
    const [frame, setFrame] = useState<HTMLIFrameElement | null>(null);
    const [url, setUrl] = useState(props.process.modifiedUrl);

    const handleAppReady = () => {
        setAppReady(true);
        if (props.onReady) {
            props.onReady();
        }
    };

    const handleFrameLoaded = (frameRef: HTMLIFrameElement) => {
        const context = frameRef?.contentWindow;
        if (context) {
            setFrame(frameRef);

            if (!isAppReady) {
                handleBindingEmitterEvents(props.process);
            }

            props.process.setEmitterContext(context);
            handleAppReady();
        }
    };

    const handleBindingEmitterEvents = (appProcess: ApplicationProcess) => {
        appProcess.emitter.on(AppMessageType.Connected, () => {
            handleAppReady();

            store.processManager.injectAuthTokenInProcess(
                appProcess,
                store.auth.accessToken,
                store.auth.userLogin,
            );
        });

        appProcess.emitter.on(AppMessageType.ForceRecieveToken, () =>
            store.processManager.injectAuthTokenInProcess(
                appProcess,
                store.auth.accessToken,
                store.auth.userLogin,
            ),
        );
    };

    useEffect(() => {
        setUrl(props.process.modifiedUrl);
    }, [props.process.modifiedUrl]);

    const appComponent = useMemo(() => {
        if (props.process.app instanceof ExternalApplication) {
            return (
                <iframe
                    onLoad={handleAppReady}
                    src={props.url}
                    ref={handleFrameLoaded}
                    title={props.process.name}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    tabIndex={-1}
                    frameBorder={0}
                ></iframe>
            );
        }
        if (props.process.app instanceof ShellApplication) {
            handleAppReady();
            return props.process.app.Component;
        }
        return <div>Unknown component</div>;
    }, [props.process.modifiedUrl]);

    return (
        <div className={classNames(style.appWindowContent)}>{appComponent}</div>
    );
});
