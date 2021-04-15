import { LayerBoxVisualizer } from "components/debug/LayerBoxVisualizer/LayerBoxVisualizer";
import React from "react";
import style from "./style.module.css";

interface ITileDesktopAreaProps {
    children?: JSX.Element | JSX.Element[] | string;
}

const className = style.tileDesktopArea;

export const TileDesktopArea = (props: ITileDesktopAreaProps) => (
    <div className={className}>
        <LayerBoxVisualizer name="Tile" />
    </div>
);
