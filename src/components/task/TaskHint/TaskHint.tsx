import React from "react";
import style from "./style.module.css";

interface ITaskHintProps {
    title: React.ReactNode;
}

const className = style.taskHint;

export const TaskHint = (props: ITaskHintProps) => (
    <div className={style.attachmentPoint}>
        <div className={className}>
            <div className={style.container}>{props.title}</div>
        </div>
    </div>
);
