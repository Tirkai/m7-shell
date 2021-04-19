import React from "react";
import style from "./style.module.css";

interface ILayerBoxVisualizerProps {
    children?: React.ReactNode;
}

const className = style.layerBoxVisualizer;

export const LayerBoxVisualizer = (props: ILayerBoxVisualizerProps) => (
    <div className={className}>{props.children}</div>
);
