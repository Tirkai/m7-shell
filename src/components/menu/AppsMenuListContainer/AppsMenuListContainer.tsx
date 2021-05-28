import { Application } from "models/Application";
import React from "react";
import { AppsMenuListItem } from "../AppsMenuListItem/AppsMenuListItem";
import style from "./style.module.css";

interface IAppsMenuListContainerProps {
    apps: Application[];
    onExecute: (app: Application) => void;
}

const className = style.appsMenuListContainer;

export const AppsMenuListContainer = (props: IAppsMenuListContainerProps) => (
    <div className={className}>
        {props.apps.map((app) => (
            <AppsMenuListItem
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
