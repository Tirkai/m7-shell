import React from "react";
import style from "./style.module.css";

interface IPanelInformerTextProps {
    children: React.ReactNode;
}

const className = style.panelInformerText;

export const PanelInformerText = (props: IPanelInformerTextProps) => (
    <div className={className}>{props.children}</div>
);
