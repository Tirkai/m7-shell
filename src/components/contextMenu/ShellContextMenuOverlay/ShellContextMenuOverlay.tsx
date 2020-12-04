import classNames from "classnames";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import React from "react";
import style from "./style.module.css";

const className = style.shellContextMenuOverlay;

export const ShellContextMenuOverlay = observer(() => {
    const store = useStore();

    return (
        <div
            className={classNames(style.shellContextMenuOverlay, {
                [style.show]: store.contextMenu.isShow,
            })}
            onClick={() => store.contextMenu.hideContextMenu()}
        />
    );
});
