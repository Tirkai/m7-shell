import { UPPER_LEVEL_DOMAIN } from "constants/config";
import { CustomExecutor } from "extensions/CustomExecutor/CustomExecutor";
import { EmiterLogger } from "extensions/EmiterLogger/EmiterLogger";
import { strings } from "locale";
import { Application } from "models/Application";
import { ExternalApllication } from "models/ExternalApplication";
import { ShellApplication } from "models/ShellApplication";
import React from "react";
import { v4 } from "uuid";

export const registeredApps: Application[] = [
    new ExternalApllication({
        id: v4(),
        name: "People",
        key: "People",
        url: `http://people.${UPPER_LEVEL_DOMAIN}`,
        baseWidth: 400,
        baseHeight: 500,
        isVisibleInStartMenu: true,
    }),
    new ExternalApllication({
        id: v4(),
        name: strings.definedApplications.accountsMe,
        key: "AccountsMe",
        url: `http://accounts.${UPPER_LEVEL_DOMAIN}/#/me`,
        baseWidth: 800,
        baseHeight: 650,
        isVisibleInStartMenu: false,
    }),
    new ExternalApllication({
        id: v4(),
        name: `AccountsMe [local]`,
        key: "AccountsMe",
        url: `http://localhost:3001/#/me`,
        baseWidth: 800,
        baseHeight: 650,
        isVisibleInStartMenu: false,
    }),
    new ExternalApllication({
        id: v4(),
        name: "[local] Accounts",
        key: "AccountsLocal",
        url: "http://localhost:3001",
        baseWidth: 800,
        baseHeight: 650,
        isVisibleInStartMenu: false,
    }),
    new ExternalApllication({
        id: v4(),
        name: strings.definedApplications.license,
        key: "License",
        url: `http://license.${UPPER_LEVEL_DOMAIN}`,
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
        name: "EmiterLogger",
        key: "EmiterLogger",
        Component: <EmiterLogger />,
        baseWidth: 700,
        baseHeight: 600,
        isVisibleInStartMenu: false,
    }),
];
