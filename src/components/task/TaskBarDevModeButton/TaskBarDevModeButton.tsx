import { SVGIcon } from "@algont/m7-ui";
import { settings } from "assets/icons";
import React from "react";
import { TaskBarItemContainer } from "../TaskBarItemContainer/TaskBarItemContainer";
import style from "./style.module.css";

interface ITaskBarDevModeButtonProps {
    onClick: () => void;
}

export const TaskBarDevModeButton = (props: ITaskBarDevModeButtonProps) => {
    return (
        <div className={style.taskBarDevModeButton} onClick={props.onClick}>
            <TaskBarItemContainer>
                <SVGIcon source={settings} color="white" />
            </TaskBarItemContainer>
        </div>
    );
};
