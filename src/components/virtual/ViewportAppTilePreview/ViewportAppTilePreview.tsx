import { SVGIcon } from "@algont/m7-ui";
import classNames from "classnames";
import { ViewportAppTilePreviewItem } from "components/virtual/ViewportAppTilePreviewItem/ViewportAppTilePreviewItem";
import { ApplicationProcess } from "models/ApplicationProcess";
import React from "react";
import style from "./style.module.css";

interface IViewportAppTilePreviewProps {
    areas: string;
    columns: number;
    rows: number;
    processes: ApplicationProcess[];
}

const className = style.viewportAppTilePreview;

export const ViewportAppTilePreview = (props: IViewportAppTilePreviewProps) => (
    <div
        className={classNames(className)}
        style={{
            gridTemplateAreas: props.areas,

            gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
            gridTemplateRows: `repeat(${props.rows}, 1fr)`,
        }}
    >
        {props.processes.map((process) => (
            <ViewportAppTilePreviewItem
                key={process.id}
                area={process.window.area}
                icon={
                    <SVGIcon
                        source={process.app.icon}
                        size={{
                            width: "32px",
                            height: "32px",
                        }}
                        color="white"
                    />
                }
                title={process.app.name}
            />
        ))}
    </div>
);
