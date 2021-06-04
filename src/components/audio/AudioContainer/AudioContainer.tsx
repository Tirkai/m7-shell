import classNames from "classnames";
import React, { Component } from "react";
import { AudioPlayer } from "../AudioPlayer/AudioPlayer";
import style from "./style.module.css";

const className = style.audioContainer;

export class AudioContainer extends Component {
    render() {
        return (
            <div className={classNames(className)}>
                <AudioPlayer />
            </div>
        );
    }
}

export default AudioContainer;
