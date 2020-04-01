import React from "react";
import { Router, Switch } from "react-router-dom";
import { routes } from "routes";
import { mapRoutes } from "utils";
import { browserHistory } from "utils/history";

export const App: React.FC = () => (
    <Router history={browserHistory}>
        <Switch>{mapRoutes(routes)}</Switch>
    </Router>
);
