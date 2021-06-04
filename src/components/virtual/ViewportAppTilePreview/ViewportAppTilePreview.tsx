import { SVGIcon } from "@algont/m7-ui";
import classNames from "classnames";
import { ViewportAppTilePreviewItem } from "components/virtual/ViewportAppTilePreviewItem/ViewportAppTilePreviewItem";
import { ApplicationProcess } from "models/ApplicationProcess";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import style from "./style.module.css";

interface IViewportAppTilePreviewProps {
    areas: string;
    columns: number;
    rows: number;
    processes: ApplicationProcess[];
}

const className = style.viewportAppTilePreview;

export const ViewportAppTilePreview = (props: IViewportAppTilePreviewProps) => {
    // TODO: Сделать нормально, когда появится время
    // Быстрофикс для перерендера превьюшек
    // Почему то обновление area в ApplicationWindow не вызывает перерендер
    const [key, updateKey] = useState(v4());
    useEffect(() => updateKey(v4()), [props.processes]);

    return (
        <div
            key={key}
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
};
