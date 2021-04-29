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

export const VirtualFramePreview = (props: IVirtualFramePreviewProps) => {
    const handleDelete = (e: React.MouseEvent) => {
        if (props.onDelete) {
            props.onDelete();
        }
        e.stopPropagation();
    };

    return (
        <div
            className={classNames(className, { [style.active]: props.active })}
            onClick={props.onClick}
        >
            {props.onDelete && (
                <div className={style.actions}>
                    <IconButton color="secondary" onClick={handleDelete}>
                        <Clear />
                    </IconButton>
                </div>
            )}
            <div className={style.content}>{props.children}</div>
        </div>
    );
};
