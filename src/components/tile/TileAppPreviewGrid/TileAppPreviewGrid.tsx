import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

interface ITileAppPreviewGridProps {
    enabledTiles: boolean;
    children: JSX.Element | JSX.Element[] | string;
    areas: string;
    columns: number;
    rows: number;
}

const className = style.tileAppPreviewGrid;

export const TileAppPreviewGrid = (props: ITileAppPreviewGridProps) => (
    <div
        className={classNames(className)}
        style={
            props.enabledTiles
                ? {
                      gridTemplateAreas: props.areas,

                      gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
                      gridTemplateRows: `repeat(${props.rows}, 1fr)`,
                  }
                : undefined
        }
    >
        {props.children}
    </div>
);
