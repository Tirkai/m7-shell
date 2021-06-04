import { AppsMenuTileItem } from "components/menu/AppsMenuTileItem/AppsMenuTileItem";
import { Application } from "models/Application";
import React from "react";
import style from "./style.module.css";

interface IAppsMenuTileContainerProps {
    apps: Application[];
    onExecute: (app: Application) => void;
}

const className = style.appsMenuTileContainer;

export const AppsMenuTileContainer = (props: IAppsMenuTileContainerProps) => (
    <div className={className}>
        {props.apps.map((app) => (
            <AppsMenuTileItem
                key={app.id}
                icon={app.icon}
                title={app.name}
                isExecuted={app.isExecuted}
                isAvailable={app.isAvailable}
                onClick={() => props.onExecute(app)}
            />
        ))}
    </div>
);
