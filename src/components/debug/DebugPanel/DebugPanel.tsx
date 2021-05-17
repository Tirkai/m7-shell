import React from "react";
import style from "./style.module.css";

interface IDebugPanelProps {
    children: React.ReactNode;
}

const className = style.debugPanel;

export const DebugPanel = (props: IDebugPanelProps) => (
    <div className={className}>{props.children}</div>
);
