import { terminal } from "assets/icons";
import { CustomExecutor } from "extensions/CustomExecutor/CustomExecutor";
import { strings } from "locale";
import { Application } from "models/Application";
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
];
