import React from "react";
import style from "./style.module.css";

interface IDisplayModeChooserGridProps {
    children: React.ReactNode;
}

const className = style.displayModeChooserGrid;

export const DisplayModeChooserGrid = (props: IDisplayModeChooserGridProps) => (
    <div className={className}>{props.children}</div>
);
