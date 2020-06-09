import { videocam } from "assets/icons";
import { EmiterLogger } from "extensions/EmiterLogger/EmiterLogger";
import { Application } from "models/Application";
import { ExternalApllication } from "models/ExternalApplication";
import { ShellApplication } from "models/ShellApplication";
import React from "react";
import { v4 } from "uuid";

export const registeredApps: Application[] = [
    new ExternalApllication({
        id: v4(),
        name: "АССаД-Видео",
        url: "http://video.test1/lab/setup",
        icon: videocam,
    }),
    new ExternalApllication({
        id: v4(),
        name: "Отчеты",
        url: "http://reports.test1",
        baseWidth: 800,
        baseHeight: 600,
    }),
    new ExternalApllication({
        id: v4(),
        name: "[c9s] Accounts",
        key: "Accounts",
        url: "http://accounts.c9s",
        baseWidth: 800,
        baseHeight: 650,
    }),
    new ExternalApllication({
        id: v4(),
        name: "[local] Accounts",
        key: "AccountsLocal",
        url: "http://localhost:3001",
        baseWidth: 800,
        baseHeight: 650,
    }),
    new ExternalApllication({
        id: v4(),
        name: "Legacy Accounts [test1]",
        key: "AccountsTest1",
        url: "http://accounts.test1",
        baseWidth: 800,
        baseHeight: 650,
    }),
    new ExternalApllication({
        id: v4(),
        name: "ME [local]",
        key: "AccountsMe",
        url: "http://localhost:3001/#/me",
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
];
