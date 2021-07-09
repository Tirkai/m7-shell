import { terminal } from "assets/icons";
import { CustomExecutor } from "extensions/CustomExecutor/CustomExecutor";
import { strings } from "locale";
import { Application } from "models/app/Application";
import { ExternalApplication } from "models/app/ExternalApplication";
import { ShellApplication } from "models/app/ShellApplication";
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
    new ExternalApplication({
        id: v4(),
        name: "app.dashboard",
        key: "app.dashboard",
        url: "http://shell.zab/ext/dashboard",
        isVisibleInStartMenu: false,
    }),
];
