import { MarkerType, useMarker } from "@algont/m7-react-marker";
import { SVGIcon } from "@algont/m7-ui";
import { mute, sound, soundLow, soundMiddle } from "assets/icons";
import classNames from "classnames";
import React, { useMemo } from "react";
import { TaskBarItemContainer } from "../TaskBarItemContainer/TaskBarItemContainer";
import style from "./style.module.css";

const className = style.taskBarSoundButton;

interface ITaskBarSoundButtonProps {
    isMuted?: boolean;
    volume: number;
    onClick: () => void;
}

export const TaskBarSoundButton = (props: ITaskBarSoundButtonProps) => {
    const { createMemoizedMarker } = useMarker();

    const icon = useMemo(() => {
        if (!props.isMuted) {
            if (props.volume > 0.66) {
                return <SVGIcon source={sound} key="sound" color="white" />;
            }
            if (props.volume > 0.33 && props.volume <= 0.66) {
                return (
                    <SVGIcon
                        source={soundMiddle}
                        key="soundMiddle"
                        color="white"
                    />
                );
            }
            if (props.volume > 0 && props.volume <= 0.33) {
                return (
                    <SVGIcon source={soundLow} key="soundLow" color="white" />
                );
            }
            if (props.volume <= 0) {
                return <SVGIcon source={mute} key="soundLow" color="white" />;
            }
        } else {
            return <SVGIcon source={mute} key="soundDisable" color="white" />;
        }
    }, [props.volume]);

    return (
        <div
            className={classNames(className)}
            onClick={props.onClick}
            {...createMemoizedMarker(MarkerType.Element, "TaskBar.SoundButton")}
        >
            <TaskBarItemContainer>{icon}</TaskBarItemContainer>
        </div>
    );
};
