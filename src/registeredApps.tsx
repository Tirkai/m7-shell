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
        name: "Accounts",
        key: "Accounts",
        url: "http://video.test1/accounts",
        baseWidth: 800,
        baseHeight: 600,
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
