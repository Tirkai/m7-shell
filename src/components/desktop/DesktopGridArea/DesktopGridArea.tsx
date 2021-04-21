import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import React from "react";
import { DesktopGridConfig } from "../DesktopGridConfig/DesktopGridConfig";
import style from "./style.module.css";

interface IDesktopGridAreaProps {
    children?: React.ReactNode;
}

const className = style.desktopGridArea;

export const DesktopGridArea = observer((props: IDesktopGridAreaProps) => {
    const store = useStore();

    const isEdit = store.desktop.isEditMode;
    return (
        <>
            <div className={className}>
                <div className={style.panes}></div>
                <div className={style.config}>
                    {store.desktop.isLayoutMode && store.desktop.isEditMode && (
                        <DesktopGridConfig />
                    )}
                </div>
            </div>
        </>
    );
});
