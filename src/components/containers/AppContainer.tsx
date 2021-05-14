import { AuthScreen } from "components/layout/AuthScreen/AuthScreen";
import { AwaitVerifyScreen } from "components/layout/AwaitVerifyScreen/AwaitVerifyScreen";
import { ShellScreen } from "components/layout/ShellScreen/ShellScreen";
import { MessageDialog } from "components/message/MessageDialog/MessageDialog";
import { PerformanceContext } from "contexts/PerformanceContext";
import { PerformanceModeType } from "enum/PerformanceModeType";
import { CustomExecutor } from "extensions/CustomExecutor/CustomExecutor";
import { createBrowserHistory } from "history";
import { useStore } from "hooks/useStore";
import { IPerformanceMode } from "interfaces/performance/IPerformanceMode";
import { observer } from "mobx-react";
import { DefaultPerformanceMode } from "models/DefaultPerformanceMode";
import { PotatoPerformanceMode } from "models/PotatoPerformanceMode";
import "moment/locale/ru";
import React, { useEffect, useState } from "react";
import { Route, Router, Switch } from "react-router-dom";

const history = createBrowserHistory();

export const AppContainer = observer(() => {
    const store = useStore();
    const [perfMode, setPerfMode] = useState<IPerformanceMode>(
        new DefaultPerformanceMode(),
    );

    const onMount = () => {
        window.addEventListener("contextmenu", (event) =>
            event.preventDefault(),
        );
        const getCloseBrowserWindowDenied = () =>
            store.applicationManager.executedApplications.length > 0;

        window.onbeforeunload = () => getCloseBrowserWindowDenied();

        // TODO: fix
        const urlParams = new URL(window.location.href).searchParams;
        const enableAutoRun = urlParams.get("enableAutoLogin");
        const autoLogin = urlParams.get("login");
        const autoPassword = urlParams.get("password");

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

        // const displayMode = urlParams.get("displayMode") as DisplayModeType;

        if (!!parseInt(enableAutoRun ?? "0")) {
            if (autoLogin && autoPassword) {
                store.auth.login(autoLogin, autoPassword);
            } else {
                console.warn("Invalid parameters for auto login");
            }
        }

        // if (displayMode) {
        //     store.shell.setDisplayMode(displayMode);
        // }
    };

    useEffect(onMount, []);

    return (
        <PerformanceContext.Provider value={{ mode: perfMode }}>
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
                    <Route path="/internalApps/">
                        <Route path="/internalApps/CustomExecutor">
                            <CustomExecutor />
                        </Route>
                    </Route>
                </Switch>
            </Router>

            <MessageDialog />
        </PerformanceContext.Provider>
    );
});
