import { SVGIcon } from "@algont/m7-ui";
import { mute, sound } from "assets/icons";
import classNames from "classnames";
import React, { Component } from "react";
import style from "./style.module.css";

const className = style.taskBarSound;

interface ITaskbarSoundProps {
    isMuted?: boolean;
}

export class TaskBarSound extends Component<ITaskbarSoundProps> {
    render() {
        return (
            <div className={classNames(className)}>
                {!this.props.isMuted ? (
                    <SVGIcon source={sound} key="soundEnable" color="white" />
                ) : (
                    <SVGIcon source={mute} key="soundDisable" color="white" />
                )}
            </div>
        );
    }
}
