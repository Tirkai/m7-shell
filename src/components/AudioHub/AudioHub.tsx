import { SVGIcon } from "@algont/m7-ui";
import { Slider } from "@material-ui/core";
import { mute, sound, soundLow, soundMiddle } from "assets/icons";
import classNames from "classnames";
import { ShellPanelType } from "enum/ShellPanelType";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import style from "./style.module.css";
const className = style.audioHub;
@inject("store")
@observer
export class AudioHub extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    handleChangeVolume = (value: number | number[]) => {
        if (typeof value === "number") {
            this.store.audio.setVolume(value);
        }
    };

    handleMute = () => {
        this.store.audio.setMute(!this.store.audio.isMute);
    };

    getIconByVolume = () => {
        if (this.store.audio.volume > 0.66) {
            return <SVGIcon source={sound} key="sound" color="white" />;
        }
        if (this.store.audio.volume > 0.33 && this.store.audio.volume <= 0.66) {
            return (
                <SVGIcon source={soundMiddle} key="soundMiddle" color="white" />
            );
        }
        if (this.store.audio.volume > 0 && this.store.audio.volume <= 0.33) {
            return <SVGIcon source={soundLow} key="soundLow" color="white" />;
        }
        if (this.store.audio.volume <= 0) {
            return <SVGIcon source={mute} key="soundLow" color="white" />;
        }
    };

    render() {
        return (
            <div
                className={classNames(className, {
                    [style.show]:
                        this.store.shell.activePanel ===
                        ShellPanelType.AudioHub,
                })}
            >
                <div className={style.container}>
                    <div className={style.content}>
                        <div className={style.icon} onClick={this.handleMute}>
                            {!this.store.audio.isMute ? (
                                this.getIconByVolume()
                            ) : (
                                <SVGIcon source={mute} key="soundDisable" />
                            )}
                        </div>
                        <div className={style.volume}>
                            <Slider
                                value={this.store.audio.volume}
                                onChange={(event, value) =>
                                    this.handleChangeVolume(value)
                                }
                                classes={{
                                    track: style.slider,
                                    thumb: style.slider,
                                }}
                                min={0}
                                max={1}
                                step={0.01}
                            ></Slider>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
