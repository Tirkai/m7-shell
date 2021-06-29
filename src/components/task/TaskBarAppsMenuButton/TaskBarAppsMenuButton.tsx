import { MarkerType, useMarker } from "@algont/m7-react-marker";
import { SVGIcon } from "@algont/m7-ui";
import { apps } from "assets/icons";
import React from "react";
import { TaskBarItemContainer } from "../TaskBarItemContainer/TaskBarItemContainer";
import style from "./style.module.css";

const className = style.taskBarAppsMenuButton;

interface ITaskbarAppsMenuButtonProps {
    onClick: () => void;
}

export const TaskBarAppsMenuButton = (props: ITaskbarAppsMenuButtonProps) => {
    const { createMemoizedMarker } = useMarker();

    return (
        <div
            className={className}
            onClick={props.onClick}
            {...createMemoizedMarker(
                MarkerType.Element,
                "TaskBar.AppsMenuButton",
            )}
        >
            <TaskBarItemContainer>
                <SVGIcon source={apps} color="white" />
            </TaskBarItemContainer>
        </div>
    );
};
