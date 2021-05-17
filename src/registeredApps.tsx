import { rocket, terminal } from "assets/icons";
import { CustomExecutor } from "extensions/CustomExecutor/CustomExecutor";
import { LaunchQueryBuilder } from "extensions/LaunchQueryBuilder/LaunchQueryBuilder";
import { strings } from "locale";
import { Application } from "models/Application";
import { ExternalApplication } from "models/ExternalApplication";
import { ShellApplication } from "models/ShellApplication";
import React from "react";
import { v4 } from "uuid";

export const registeredApps: Application[] = [
    new ShellApplication({
        id: v4(),
        name: strings.shellApps.customExecutor.title,
        key: "CustomExecutor",
        Component: <CustomExecutor />,
        baseWidth: 500,
        baseHeight: 200,
        isVisibleInStartMenu: false,
        icon: terminal,
    }),
    new ShellApplication({
        id: v4(),
        name: strings.shellApps.launchQueryBuilder.title,
        key: "LaunchQueryBuilder",
        Component: <LaunchQueryBuilder />,
        baseWidth: 600,
        baseHeight: 700,
        isVisibleInStartMenu: false,
        icon: rocket,
    }),
    new ExternalApplication({
        id: v4(),
        name: "core.app",
        key: "Core",
        url: "/",
        baseWidth: 600,
        baseHeight: 700,
        isVisibleInStartMenu: false,
    }),
    new ExternalApplication({
        id: v4(),
        name: "core.autodoc",
        key: "Autodoc",
        url: window.location.protocol + "//" + window.location.host + "/docs",
        baseWidth: 600,
        baseHeight: 700,
        isVisibleInStartMenu: false,
    }),
];
