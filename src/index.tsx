import { MuiThemeProvider } from "@material-ui/core";
import { StylesProvider } from "@material-ui/styles";
import { App } from "App";
import { Provider } from "mobx-react";
import React from "react";
import ReactDOM from "react-dom";
import { AppStore } from "stores/AppStore";
import { theme } from "utils/theme";
import "./index.css";

const store = new AppStore();

ReactDOM.render(
    <Provider store={store}>
        <StylesProvider injectFirst={true}>
            <MuiThemeProvider theme={theme}>
                <App />
            </MuiThemeProvider>
        </StylesProvider>
    </Provider>,
    document.getElementById("root"),
);
