import { SVGIcon } from "@algont/m7-ui";
import React from "react";
import style from "./style.module.css";

interface IViewportAppWindowPreviewItemProps {
    icon: string;
    name: string;
}

const className = style.viewportAppWindowPreviewItem;

export const ViewportAppWindowPreviewItem = (
    props: IViewportAppWindowPreviewItemProps,
) => (
    <div className={className}>
        <SVGIcon
            source={props.icon}
            size={{ width: "32px", height: "32px" }}
            color="white"
        />
    </div>
);
