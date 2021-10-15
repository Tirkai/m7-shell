import classNames from "classnames";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import React from "react";
import style from "./style.module.css";

const className = style.rootContainer;

interface IRootContainerProps {
    children?: React.ReactNode;
}

export const RootContainer = observer((props: IRootContainerProps) => {
    const store = useStore();

    const { config } = store.config;

    return (
        <div
            className={classNames(className, {
                [style.disableCursor]: !config.properties.cursor.enabled,
            })}
        >
            {props.children}
        </div>
    );
});
