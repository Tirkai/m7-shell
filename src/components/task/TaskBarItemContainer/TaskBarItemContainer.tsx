import React from "react";
import style from "./style.module.css";

interface ITaskBarItemContainerProps {
    children: React.ReactNode;
}

const className = style.taskBarItemContainer;

export const TaskBarItemContainer = (props: ITaskBarItemContainerProps) => (
    <div className={className}>{props.children}</div>
);
