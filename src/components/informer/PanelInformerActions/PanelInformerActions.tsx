import React from "react";
import style from "./style.module.css";

interface IPanelInformerActionsProps {
    children: JSX.Element | JSX.Element[] | string;
}

const className = style.panelInformerActions;

export const PanelInformerActions = (props: IPanelInformerActionsProps) => (
    <div className={className}>{props.children}</div>
);
