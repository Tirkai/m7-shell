import classNames from "classnames";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import style from "./style.module.css";
const className = style.audioPlayer;
@inject("store")
@observer
export class AudioPlayer extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    setRef = (ref: HTMLAudioElement) => {
        this.store.audio.setAudio(ref);
    };

    render() {
        return (
            <div className={classNames(className)}>
                <audio
                    controls
                    src={"/sounds/notification.mp3"}
                    ref={this.setRef}
                />
            </div>
        );
    }
}
