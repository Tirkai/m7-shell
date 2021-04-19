import React from "react";
import style from "./style.module.css";

interface ITileChooserGridProps {
    children: React.ReactNode;
}

const className = style.tileChooserGrid;

export const TileChooserGrid = (props: ITileChooserGridProps) => (
    <div className={className}>{props.children}</div>
);
