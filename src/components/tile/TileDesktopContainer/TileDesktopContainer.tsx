import React from "react";
import { TileDesktopArea } from "../TileDesktopArea/TileDesktopArea";
import style from "./style.module.css";

const className = style.tileDesktopContainer;

export const TileDesktopContainer = () => (
    <div className={className}>
        <div className={style.container}>
            <TileDesktopArea />
            <TileDesktopArea />
            <TileDesktopArea />
            <TileDesktopArea />
        </div>
    </div>
);
