import { MarkerType, useMarker } from "@algont/m7-react-marker";
import { SVGIcon } from "@algont/m7-ui";
import { virtual } from "assets/icons";
import React from "react";
import { TaskBarItemContainer } from "../TaskBarItemContainer/TaskBarItemContainer";
import style from "./style.module.css";

interface ITaskBarViewportButtonProps {
    onClick: () => void;
}

const className = style.taskBarViewportButton;

export const TaskBarViewportButton = (props: ITaskBarViewportButtonProps) => {
    const { createMemoizedMarker } = useMarker();
    return (
        <div
            className={className}
            {...createMemoizedMarker(
                MarkerType.Element,
                "TaskBar.ViewportButton",
            )}
            onClick={props.onClick}
        >
            <TaskBarItemContainer>
                <SVGIcon source={virtual} color="white" />
            </TaskBarItemContainer>
        </div>
    );
};
