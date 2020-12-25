import classNames from "classnames";
import { PerformanceContext } from "contexts/PerformanceContext";
import { IStore } from "interfaces/common/IStore";
import React, { useContext } from "react";
import style from "./style.module.css";
const className = style.backdropWrapper;

interface IBackdropWrapperProps extends IStore {
    active?: boolean;
    children: JSX.Element | JSX.Element[];
}

export const BackdropWrapper = (props: IBackdropWrapperProps) => {
    const { mode } = useContext(PerformanceContext);
    return (
        <div
            className={classNames(className, {
                [style.active]: props.active && mode.enableBackdrop,
            })}
        >
            {props.children}
        </div>
    );
};
