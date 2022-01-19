import classNames from "classnames";
import { HubBackdrop } from "components/hub/HubBackdrop/HubBackdrop";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { ExternalApplication } from "models/app/ExternalApplication";
import React, { Fragment } from "react";
import { v4 } from "uuid";
import { DevModeExecutor } from "../DevModeExecutor/DevModeExecutor";
import style from "./style.module.css";

export const DevModeHub = observer(() => {
    const store = useStore();

    const isShow = store.panelManager.devModeHubShow;

    const handleExecuteApp = (url: string) => {
        const id = v4();

        const app = new ExternalApplication({
            id,
            name: url,
            url: url,
            key: `${id}`,
        });

        new ApplicationRunner(store).run(app, {
            focusWindowAfterInstantiate: true,
        });
    };

    return (
        <div
            className={classNames(style.devModeHub, { [style.isShow]: isShow })}
        >
            <HubBackdrop>
                {isShow ? (
                    <DevModeExecutor onExecute={handleExecuteApp} />
                ) : (
                    <Fragment />
                )}
            </HubBackdrop>
        </div>
    );
});
