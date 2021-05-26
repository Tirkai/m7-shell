import React from "react";
import style from "./style.module.css";

interface IViewportAppTilePreviewItemProps {
    icon: React.ReactNode;
    title: React.ReactNode;
    area: string;
}

const className = style.viewportAppTileItemPreview;

export const ViewportAppTilePreviewItem = (
    props: IViewportAppTilePreviewItemProps,
) => (
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
