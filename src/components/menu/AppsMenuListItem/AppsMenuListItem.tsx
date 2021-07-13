import { MarkerType, useMarker } from "@algont/m7-react-marker";
import { SVGIcon } from "@algont/m7-ui";
import classNames from "classnames";
import React from "react";
import { AppsMenuApplicationIcon } from "../AppsMenuApplicationIcon/AppsMenuApplicationIcon";
import style from "./style.module.css";

interface IAppsMenuListItemProps {
    id: string;
    icon: string;
    title: string;
    isExecuted: boolean;
    isAvailable: boolean;
    onClick: () => void;
}

export const AppsMenuListItem = (props: IAppsMenuListItemProps) => {
    const { createMemoizedMarker } = useMarker();
    return (
        <div
            className={classNames(style.appsMenuListItem, {
                [style.executed]: props.isExecuted,
                [style.unavailable]: props.isAvailable,
            })}
            onClick={props.onClick}
            {...createMemoizedMarker(MarkerType.Element, "AppsMenuItem")}
            {...createMemoizedMarker(MarkerType.Id, props.id)}
        >
            <AppsMenuApplicationIcon>
                <SVGIcon
                    source={props.icon}
                    size={{ width: "32px", height: "32px" }}
                    color="white"
                />
            </AppsMenuApplicationIcon>
            {props.isExecuted ? <div className={style.executeStatus} /> : ""}
            <div className={style.title}>{props.title}</div>
        </div>
    );
};
