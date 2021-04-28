import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

interface IBaseHubProps {
    children: React.ReactNode;
    show: boolean;
    width?: string;
    height?: string;
}

const className = style.baseHub;

export const BaseHub = (props: IBaseHubProps) => {
    const width = props.width ?? 300;
    const height = props.height ?? "auto";
    return (
        <div
            className={classNames(className, {
                [style.show]: props.show,
            })}
            style={{ width, height }}
        >
            <div className={style.container}>
                <div className={style.content}>{props.children}</div>
            </div>
        </div>
    );
};
