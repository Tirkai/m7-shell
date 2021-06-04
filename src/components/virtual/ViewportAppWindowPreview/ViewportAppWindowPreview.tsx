import { ApplicationProcess } from "models/ApplicationProcess";
import React from "react";
import { ViewportAppWindowPreviewItem } from "../ViewportAppWindowPreviewItem/ViewportAppWindowPreviewItem";
import style from "./style.module.css";

interface IViewportAppWindowPreviewProps {
    processes: ApplicationProcess[];
}

const className = style.viewportAppWindowPreview;

export const ViewportAppWindowPreview = (
    props: IViewportAppWindowPreviewProps,
) => (
    <div className={className}>
        {props.processes.map((item) => (
            <ViewportAppWindowPreviewItem
                key={item.id}
                name={item.app.name}
                icon={item.app.icon}
            />
        ))}
    </div>
);
