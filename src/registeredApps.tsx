import { videocam } from "assets/icons";
import { UPPER_LEVEL_DOMAIN } from "constants/config";
import { CustomExecutor } from "extensions/CustomExecutor/CustomExecutor";
import { EmiterLogger } from "extensions/EmiterLogger/EmiterLogger";
import { Application } from "models/Application";
import { ExternalApllication } from "models/ExternalApplication";
import { ShellApplication } from "models/ShellApplication";
import React from "react";
import { v4 } from "uuid";

export const registeredApps: Application[] = [
    new ExternalApllication({
        id: v4(),
        name: "Видео. Просмотр",
        url: `http://video.${UPPER_LEVEL_DOMAIN}/live`,
        icon: videocam,
    }),
    new ExternalApllication({
        id: v4(),
        name: "Видео. Архив",
        url: `http://video.${UPPER_LEVEL_DOMAIN}/archive`,
        icon: videocam,
    }),
    new ExternalApllication({
        id: v4(),
        name: "Видео. Настройки",
        url: `http://video.${UPPER_LEVEL_DOMAIN}/setup`,
        icon: videocam,
    }),
    new ExternalApllication({
        id: v4(),
        name: `Accounts [${UPPER_LEVEL_DOMAIN}]`,
        key: "Accounts",
        url: `http://accounts.${UPPER_LEVEL_DOMAIN}`,
        baseWidth: 800,
        baseHeight: 650,
    }),
    new ExternalApllication({
        id: v4(),
        name: `Reports`,
        key: "Reports",
        url: `http://reports.${UPPER_LEVEL_DOMAIN}`,
        baseWidth: 800,
        baseHeight: 650,
    }),
    new ExternalApllication({
        id: v4(),
        name: `AccountsMe [${UPPER_LEVEL_DOMAIN}]`,
        key: "AccountsMe",
        url: `http://accounts.${UPPER_LEVEL_DOMAIN}/#/me`,
        baseWidth: 800,
        baseHeight: 650,
    }),
    new ExternalApllication({
        id: v4(),
        name: `AccountsMe [local]`,
        key: "AccountsMe",
        url: `http://localhost:3001/#/me`,
        baseWidth: 800,
        baseHeight: 650,
    }),
    new ShellApplication({
        id: v4(),
        name: "CustomExecutor",
        key: "CustomExecutor",
        Component: <CustomExecutor />,
        baseWidth: 500,
        baseHeight: 200,
    }),
    new ExternalApllication({
        id: v4(),
        name: "[local] Accounts",
        key: "AccountsLocal",
        url: "http://localhost:3001",
        baseWidth: 800,
        baseHeight: 650,
    }),
    new ShellApplication({
        id: v4(),
        name: "EmiterLogger",
        key: "EmiterLogger",
        Component: <EmiterLogger />,
        baseWidth: 700,
        baseHeight: 600,
    }),
    new ExternalApllication({
        id: v4(),
        name: "Gandalf",
        key: "Gandalf",
        url: "https://www.youtube.com/embed/G1IbRujko-A",
    }),
];
