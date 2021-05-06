import React from "react";
import style from "./style.module.css";

interface ITileAppPreviewItemProps {
    icon: React.ReactNode;
    title: React.ReactNode;
    area: string;
}

const className = style.tileAppPreview;

export const TileAppPreviewItem = (props: ITileAppPreviewItemProps) => (
    <div
        className={className}
        style={{
            gridArea: props.area,
        }}
    >
        <div className={style.container}>
            <div className={style.icon}>{props.icon}</div>
            {/* <div className={style.title}>{props.title}</div> */}
        </div>
    </div>
);
