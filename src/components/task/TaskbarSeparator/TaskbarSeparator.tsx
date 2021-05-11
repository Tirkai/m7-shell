import React from "react";
import style from "./style.module.css";

const className = style.taskbarSeparator;

export const TaskbarSeparator = () => (
    <div className={className}>
        <div className={style.container}></div>
    </div>
);
