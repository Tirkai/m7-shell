import classNames from "classnames";
import React from "react";
import { TaskbarSeparator } from "../TaskbarSeparator/TaskbarSeparator";
import style from "./style.module.css";

interface ITaskGroupProps {
    children: React.ReactNode;
    active: boolean;
}

const className = style.taskGroup;

export const TaskGroup = (props: ITaskGroupProps) => (
    <div className={classNames(className)}>
        <TaskbarSeparator />
        <div
            className={classNames(style.container, {
                [style.active]: props.active,
            })}
        >
            {props.children}
        </div>
    </div>
);
