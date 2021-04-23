import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

interface IPanelInformerProps {
    children: React.ReactNode;
    nonPadding?: boolean;
}

const className = style.panelInformer;

export const PanelInformer = (props: IPanelInformerProps) => (
    <div className={className}>
        <div
            className={classNames(style.container, {
                [style.nonPadding]: props.nonPadding,
            })}
        >
            {props.children}
        </div>
    </div>
);
