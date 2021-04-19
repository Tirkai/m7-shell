import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

interface IBaseHubProps {
    children: React.ReactNode;
    show: boolean;
}

const className = style.baseHub;

export const BaseHub = (props: IBaseHubProps) => (
    <div
        className={classNames(className, {
            [style.show]: props.show,
        })}
    >
        <div className={style.container}>
            <div className={style.content}>{props.children}</div>
        </div>
    </div>
);
