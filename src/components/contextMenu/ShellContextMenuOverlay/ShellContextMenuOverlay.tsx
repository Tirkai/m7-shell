import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

interface IShellContextMenuOverlayProps {
    isShow: boolean;
    onClick: () => void;
}

export const ShellContextMenuOverlay = (
    props: IShellContextMenuOverlayProps,
) => {
    return (
        <div
            className={classNames(style.shellContextMenuOverlay, {
                [style.show]: props.isShow,
            })}
            onClick={() => props.onClick()}
        />
    );
};
