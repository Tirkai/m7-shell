import { SVGIcon } from "@algont/m7-ui";
import { mute, sound, soundLow, soundMiddle } from "assets/icons";
import classNames from "classnames";
import React, { Component } from "react";
import style from "./style.module.css";

const className = style.taskBarSound;

interface ITaskbarSoundProps {
    isMuted?: boolean;
    volume: number;
}

export class TaskBarSound extends Component<ITaskbarSoundProps> {
    getIconByVolume = () => {
        if (this.props.volume > 0.66) {
            return <SVGIcon source={sound} key="sound" color="white" />;
        }
        if (this.props.volume > 0.33 && this.props.volume <= 0.66) {
            return (
                <SVGIcon source={soundMiddle} key="soundMiddle" color="white" />
            );
        }
        if (this.props.volume > 0 && this.props.volume <= 0.33) {
            return <SVGIcon source={soundLow} key="soundLow" color="white" />;
        }
        if (this.props.volume <= 0) {
            return <SVGIcon source={mute} key="soundLow" color="white" />;
        }
    };

    render() {
        return (
            <div className={classNames(className)}>
                {!this.props.isMuted ? (
                    this.getIconByVolume()
                ) : (
                    <SVGIcon source={mute} key="soundDisable" color="white" />
                )}
            </div>
        );
    }
}
