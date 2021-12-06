import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

interface ITaskBarBadgeProps {
    children?: React.ReactNode;
    size?: "medium" | "small";
    severity?: "info" | "attention";
}

export const TaskBarBadge = (props: ITaskBarBadgeProps) => {
    return (
        <div
            className={classNames(
                style.taskBarBadge,
                style[props.size ?? "medium"],
                style[props.severity ?? "info"],
            )}
        >
            {props.children}
        </div>
    );
};
