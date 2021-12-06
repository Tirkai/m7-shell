import { ServiceProvider } from "@algont/m7-crud-helper";
import { CssVariablesProvider } from "@algont/m7-css-vars";
import { LinearProgress } from "@material-ui/core";
import { AuthScreen } from "components/layout/AuthScreen/AuthScreen";
import { AwaitVerifyScreen } from "components/layout/AwaitVerifyScreen/AwaitVerifyScreen";
import { ShellScreen } from "components/layout/ShellScreen/ShellScreen";
import { MessageDialog } from "components/message/MessageDialog/MessageDialog";
import { PerformanceProvider } from "components/performance/PerformanceProvider/PerformanceProvider";
import { DocumentEventsBinder } from "components/utility/DocumentEventsBinder/DocumentEventsBinder";
import { PlatformTitle } from "components/utility/PlatformTitle/PlatformTitle";
import { createBrowserHistory } from "history";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import "moment/locale/ru";
import React, { Fragment, useEffect } from "react";
import { Route, Router, Switch } from "react-router-dom";
import { RootContainer } from "./RootContainer/RootContainer";

const history = createBrowserHistory();

export const AppContainer = observer(() => {
    const store = useStore();

    const onMount = () => {
        store.config.fetchConfigurations();
    };

    useEffect(onMount, []);

    const { config } = store.config;

    return (
        <Fragment>
            {store.config.isLoaded ? (
                <CssVariablesProvider>
                    <PerformanceProvider
                        mode={config.properties.performance.mode}
                    >
                        <PlatformTitle
                            title={config.properties.platform.name}
                            favicon={config.properties.platform.favicon.url}
                        />
                        <DocumentEventsBinder />
                        <RootContainer>
                            <Router history={history}>
                                <Switch>
                                    <Route path="/" exact>
                                        {store.auth.isAuthorized ? (
                                            store.auth.checkedAfterStart ? (
                                                <ServiceProvider
                                                    token={
                                                        store.auth.accessToken
                                                    }
                                                >
                                                    <ShellScreen />
                                                </ServiceProvider>
                                            ) : (
                                                <AwaitVerifyScreen />
                                            )
                                        ) : (
                                            <AuthScreen />
                                        )}
                                    </Route>
                                </Switch>
                            </Router>
                        </RootContainer>
                    </PerformanceProvider>
                </CssVariablesProvider>
            ) : (
                <Fragment>
                    <LinearProgress />
                </Fragment>
            )}

            <MessageDialog />
        </Fragment>
    );
});
