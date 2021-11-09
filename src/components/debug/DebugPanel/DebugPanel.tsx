import React from "react";
import style from "./style.module.css";

interface IDebugPanelProps {
    children: React.ReactNode;
    show: boolean;
}

const className = style.debugPanel;

export const DebugPanel = (props: IDebugPanelProps) =>
    props.show ? <div className={className}>{props.children}</div> : <></>;
