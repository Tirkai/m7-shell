import React from "react";
import style from "./style.module.css";

interface IVirtualFramePreviewLayoutProps {
    header: React.ReactNode;
    content: React.ReactNode;
}

const className = style.virtualFramePreviewLayout;

export const VirtualFramePreviewLayout = (
    props: IVirtualFramePreviewLayoutProps,
) => (
    <div className={className}>
        <div className={style.header}>{props.header}</div>
        <div className={style.content}>{props.content}</div>
    </div>
);
