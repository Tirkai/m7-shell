import { ApplicationPlace } from "enum/ApplicationPlace";
import { CustomExecutor } from "extensions/CustomExecutor/CustomExecutor";
import { DevModeView } from "extensions/DevModeView/DevModeView";
import { LaunchQueryBuilder } from "extensions/LaunchQueryBuilder/LaunchQueryBuilder";
import { strings } from "locale";
import { Application } from "models/Application";
import { ExternalApplication } from "models/ExternalApplication";
import { ShellApplication } from "models/ShellApplication";
import React from "react";
import { v4 } from "uuid";

export const registeredApps: Application[] = [
    new ExternalApplication({
        id: v4(),
        name: "Localhost:3000",
        key: "Localhost:3000",
        url: `http://localhost:3000`,
        baseWidth: 800,
        baseHeight: 650,
        isVisibleInStartMenu: false,
    }),
    new ExternalApplication({
        id: v4(),
        name: "Localhost:3001",
        key: "Localhost:3001",
        url: `http://localhost:3001`,
        baseWidth: 800,
        baseHeight: 650,
        isVisibleInStartMenu: false,
    }),
    new ShellApplication({
        id: v4(),
        name: "CustomExecutor",
        key: "CustomExecutor",
        Component: <CustomExecutor />,
        baseWidth: 500,
        baseHeight: 200,
        isVisibleInStartMenu: false,
    }),
    new ShellApplication({
        id: v4(),
        name: strings.shellApps.launchQueryBuilder.title,
        key: "LaunchQueryBuilder",
        Component: <LaunchQueryBuilder />,
        baseWidth: 600,
        baseHeight: 700,
        isVisibleInStartMenu: false,
    }),
    new ShellApplication({
        id: v4(),
        name: "DevMode",
        key: "DevMode",
        Component: <DevModeView />,
        baseWidth: 800,
        baseHeight: 600,
        isVisibleInStartMenu: false,
        place: ApplicationPlace.M7Menu,
    }),
];
