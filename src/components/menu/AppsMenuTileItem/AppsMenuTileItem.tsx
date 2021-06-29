import { MarkerType, useMarker } from "@algont/m7-react-marker";
import { SVGIcon } from "@algont/m7-ui";
import classNames from "classnames";
import { AppsMenuApplicationIcon } from "components/menu/AppsMenuApplicationIcon/AppsMenuApplicationIcon";
import React from "react";
import style from "./style.module.css";
interface IAppsMenuItemProps {
    id: string;
    icon: string;
    title: string;
    isExecuted: boolean;
    isAvailable: boolean;
    onClick: () => void;
}

export const AppsMenuTileItem = (props: IAppsMenuItemProps) => {
    const { createMemoizedMarker } = useMarker();

    return (
        <div
            className={classNames(style.appsMenuItem, {
                [style.executed]: props.isExecuted,
                [style.unavailable]: !props.isAvailable,
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
            {props.isExecuted && <div className={style.executeStatus} />}
            <div className={style.title}>
                <span>{props.title}</span>
            </div>
        </div>
    );
};
