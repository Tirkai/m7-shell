import { ApplicationProcess } from "models/ApplicationProcess";
import { TileGridUnit } from "models/tile/TileGridUnit";
import { IApplicationWindow } from "models/window/IApplicationWindow";
import React from "react";
import { AppWindowContent } from "../AppWindowContent/AppWindowContent";
import { AppWindowHeader } from "../AppWindowHeader/AppWindowHeader";
import style from "./style.module.css";

interface ITileWindowProps {
    // children: JSX.Element | JSX.Element[] | string;
    process: ApplicationProcess;
    window: IApplicationWindow;
    startColumn?: TileGridUnit;
    endColumn?: TileGridUnit;
    startRow?: TileGridUnit;
    endRow?: TileGridUnit;
    url: string;
}

const className = style.tileWindow;

export const TileWindow = (props: ITileWindowProps) => {
    const gridStyle = {
        gridColumnStart: props.startColumn,
        gridColumnEnd: props.endColumn,
        gridRowStart: props.startRow,
        gridRowEnd: props.endRow,
    };
    return (
        <div className={className} style={gridStyle}>
            <AppWindowHeader
                icon={props.process.app.icon}
                title={props.process.app.name}
                isFocused={false}
                visible
            />
            <AppWindowContent
                process={props.process}
                window={props.window}
                url={props.url}
            />
        </div>
    );
};
