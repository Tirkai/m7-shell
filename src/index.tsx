import { theme } from "@algont/m7-ui";
import { MuiThemeProvider } from "@material-ui/core";
import { StylesProvider } from "@material-ui/styles";
import { App } from "App";
import { PerformanceContext } from "contexts/PerformanceContext";
import { Provider } from "mobx-react";
import { DefaultPerformanceMode } from "models/DefaultPerformanceMode";
import React from "react";
import ReactDOM from "react-dom";
import { AppStore } from "stores/AppStore";
import "./index.css";

const store = new AppStore();

ReactDOM.render(
    <Provider store={store}>
        <StylesProvider injectFirst={true}>
            <MuiThemeProvider theme={theme}>
                <PerformanceContext.Provider
                    value={{ mode: new DefaultPerformanceMode() }}
                >
                    <App />
                </PerformanceContext.Provider>
            </MuiThemeProvider>
        </StylesProvider>
    </Provider>,
    document.getElementById("root"),
);
