import React from "react";
import style from "./style.module.css";

interface IPanelInformerContentProps {
    children: React.ReactNode;
}

const className = style.panelInformerContent;

export const PanelInformerContent = (props: IPanelInformerContentProps) => (
    <div className={className}>{props.children}</div>
);
