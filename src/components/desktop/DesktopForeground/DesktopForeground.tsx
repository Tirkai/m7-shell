import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import React from "react";
import style from "./style.module.css";

interface IDesktopForegroundProps {
    onDesktopClick: () => void;
}

const className = style.desktopForeground;

export const DesktopForeground = observer((props: IDesktopForegroundProps) => {
    const store = useStore();
    const { config } = store.config;
    return (
        <div
            className={className}
            style={{
                backgroundImage: `url("${config.properties.layers.foreground.wallpaper.url}")`,
            }}
            onClick={props.onDesktopClick}
        ></div>
    );
});

export default DesktopForeground;
