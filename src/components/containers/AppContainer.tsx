import { LinearProgress } from "@material-ui/core";
import { AuthScreen } from "components/layout/AuthScreen/AuthScreen";
import { AwaitVerifyScreen } from "components/layout/AwaitVerifyScreen/AwaitVerifyScreen";
import { ShellScreen } from "components/layout/ShellScreen/ShellScreen";
import { MessageDialog } from "components/message/MessageDialog/MessageDialog";
import { PerformanceProvider } from "components/performance/PerformanceProvider/PerformanceProvider";
import { PlatformTitle } from "components/utility/PlatformTitle/PlatformTitle";
import { createBrowserHistory } from "history";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import "moment/locale/ru";
import React, { Fragment, useEffect } from "react";
import { Route, Router, Switch } from "react-router-dom";

const history = createBrowserHistory();

export const AppContainer = observer(() => {
    const store = useStore();
    // const [perfMode, setPerfMode] = useState<IPerformanceMode>(
    //     new DefaultPerformanceMode(),
    // );

    const onMount = () => {
        store.config.fetchConfigurations();

        window.addEventListener("contextmenu", (event) =>
            event.preventDefault(),
        );
        const getCloseBrowserWindowDenied = () =>
            store.applicationManager.executedApplications.length > 0;

        window.onbeforeunload = () => getCloseBrowserWindowDenied();

        // const urlParams = new URL(window.location.href).searchParams;

        // const performanceMode = urlParams.get("performanceMode");

        // if (performanceMode) {
        //     let perf: IPerformanceMode;
        //     switch (performanceMode) {
        //         case PerformanceModeType.Low:
        //             perf = new PotatoPerformanceMode();
        //             break;
        //         default:
        //             perf = new DefaultPerformanceMode();
        //     }

        //     if (!perf.enableAnimation) {
        //         document.body.classList.add("no-animate");

        //         setPerfMode(perf);
        //     }
        // }
    };

    useEffect(onMount, []);

    const { config } = store.config;

    return (
        <Fragment>
            {/* <PerformanceContext.Provider value={{ mode: perfMode }}> */}
            {store.config.isLoaded ? (
                <Fragment>
                    <PerformanceProvider
                        mode={config.properties.performance.mode}
                    >
                        <PlatformTitle
                            title={config.properties.platform.name}
                            favicon={config.properties.platform.favicon.url}
                        />
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
                    </PerformanceProvider>
                </Fragment>
            ) : (
                <Fragment>
                    <LinearProgress />
                </Fragment>
            )}

            <MessageDialog />
            {/* </PerformanceContext.Provider> */}
        </Fragment>
    );
});
