import React from "react";
import style from "./style.module.css";

interface IPanelInformerProps {
    children: React.ReactNode;
}

const className = style.panelInformer;

export const PanelInformer = (props: IPanelInformerProps) => (
    <div className={className}>
        <div className={style.container}>{props.children}</div>
    </div>
);
