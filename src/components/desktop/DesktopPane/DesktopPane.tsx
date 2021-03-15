import classNames from "classnames";
import React from "react";
import { DesktopPaneHeader } from "../DesktopPaneHeader/DesktopPaneHeader";
import style from "./style.module.css";

interface IDesktopPaneProps {
    children: React.ReactNode;
    startRow: number;
    endRow: number;
    startColumn: number;
    endColumn: number;
    shrink?: boolean;
}

const className = style.desktopPane;

export const DesktopPane = (props: IDesktopPaneProps) => (
    <div
        className={className}
        style={{
            gridColumn: `${props.startColumn}/${props.endColumn}`,
            gridRow: `${props.startRow}/${props.endRow}`,
        }}
    >
        {props.shrink && <DesktopPaneHeader title="Test" />}
        <div
            className={classNames(style.container, {
                [style.shrink]: props.shrink,
            })}
        >
            {props.children}
        </div>
    </div>
);
