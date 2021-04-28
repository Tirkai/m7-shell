import { IconButton } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

interface IVirtualFramePreviewProps {
    onClick?: () => void;
    onDelete?: () => void;
    active: boolean;
    children: React.ReactNode;
}

const className = style.virtualFramePreview;

export const VirtualFramePreview = (props: IVirtualFramePreviewProps) => (
    <div className={classNames(className, { [style.active]: props.active })}>
        {props.onDelete && (
            <div className={style.actions}>
                <IconButton color="secondary" onClick={props.onDelete}>
                    <Clear />
                </IconButton>
            </div>
        )}
        <div className={style.content} onClick={props.onClick}>
            {props.children}
        </div>
    </div>
);
