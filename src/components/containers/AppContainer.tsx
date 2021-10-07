import { LinearProgress } from "@material-ui/core";
import { AuthScreen } from "components/layout/AuthScreen/AuthScreen";
import { AwaitVerifyScreen } from "components/layout/AwaitVerifyScreen/AwaitVerifyScreen";
import { ShellScreen } from "components/layout/ShellScreen/ShellScreen";
import { MessageDialog } from "components/message/MessageDialog/MessageDialog";
import { PlatformTitle } from "components/utility/PlatformTitle/PlatformTitle";
import { PerformanceContext } from "contexts/PerformanceContext";
import { createBrowserHistory } from "history";
import { useStore } from "hooks/useStore";
import { IPerformanceMode } from "interfaces/performance/IPerformanceMode";
import { observer } from "mobx-react";
import { DefaultPerformanceMode } from "models/performance/DefaultPerformanceMode";
import { PerformanceModeType } from "models/performance/PerformanceModeType";
import { PotatoPerformanceMode } from "models/performance/PotatoPerformanceMode";
import "moment/locale/ru";
import React, { Fragment, useEffect, useState } from "react";
import { Route, Router, Switch } from "react-router-dom";

const history = createBrowserHistory();

export const AppContainer = observer(() => {
    const store = useStore();
    const [perfMode, setPerfMode] = useState<IPerformanceMode>(
        new DefaultPerformanceMode(),
    );

    const onMount = () => {
        store.config.fetchConfigurations();

        window.addEventListener("contextmenu", (event) =>
            event.preventDefault(),
        );
        const getCloseBrowserWindowDenied = () =>
            store.applicationManager.executedApplications.length > 0;

        window.onbeforeunload = () => getCloseBrowserWindowDenied();

        const urlParams = new URL(window.location.href).searchParams;

        const performanceMode = urlParams.get("performanceMode");

        if (performanceMode) {
            let perf: IPerformanceMode;
            switch (performanceMode) {
                case PerformanceModeType.Low:
                    perf = new PotatoPerformanceMode();
                    break;
                default:
                    perf = new DefaultPerformanceMode();
            }

            if (!perf.enableAnimation) {
                document.body.classList.add("no-animate");

                setPerfMode(perf);
            }
        }
    };

    useEffect(onMount, []);

    const { config } = store.config;

    return (
        <PerformanceContext.Provider value={{ mode: perfMode }}>
            {store.config.isLoaded ? (
                <Fragment>
                    <PlatformTitle title={config.properties.platform.name} />
                    <Router history={history}>
                        <Switch>
                            <Route path="/" exact>
                                {store.auth.isAuthorized ? (
                                    store.auth.checkedAfterStart ? (
                                        <ShellScreen />
                                    ) : (
                                        <AwaitVerifyScreen />
                                    )
                                ) : (
                                    <AuthScreen />
                                )}
                            </Route>
                        </Switch>
                    </Router>
                </Fragment>
            ) : (
                <Fragment>
                    <LinearProgress />
                </Fragment>
            )}

            <MessageDialog />
        </PerformanceContext.Provider>
    );
});
