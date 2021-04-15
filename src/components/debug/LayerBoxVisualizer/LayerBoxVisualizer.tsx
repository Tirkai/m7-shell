import React from "react";
import style from "./style.module.css";

interface ILayerBoxVisualizerProps {
    name: string;
}

const className = style.layerBoxVisualizer;

export const LayerBoxVisualizer = (props: ILayerBoxVisualizerProps) => (
    <div className={className}>{props.name}</div>
);
