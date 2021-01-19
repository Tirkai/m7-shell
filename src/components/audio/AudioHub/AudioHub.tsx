import { SVGIcon } from "@algont/m7-ui";
import { Slider } from "@material-ui/core";
import { mute, sound, soundLow, soundMiddle } from "assets/icons";
import classNames from "classnames";
import { BackdropWrapper } from "components/layout/BackdropWrapper/BackdropWrapper";
import { PerformanceContext } from "contexts/PerformanceContext";
import { ShellPanelType } from "enum/ShellPanelType";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import React, { useContext, useState } from "react";
import style from "./style.module.css";
const className = style.audioHub;

export const AudioHub = observer(() => {
    const store = useStore();
    const [isShowBackdrop, setShowBackdrop] = useState(false);
    const performanceMode = useContext(PerformanceContext);

    const handleChangeVolume = (value: number | number[]) => {
        if (typeof value === "number") {
            store.audio.setVolume(value);
        }
    };

    const handleMute = () => {
        store.audio.setMute(!store.audio.isMute);
    };

    const getIconByVolume = () => {
        if (store.audio.volume > 0.66) {
            return <SVGIcon source={sound} key="sound" color="white" />;
        }
        if (store.audio.volume > 0.33 && store.audio.volume <= 0.66) {
            return (
                <SVGIcon source={soundMiddle} key="soundMiddle" color="white" />
            );
        }
        if (store.audio.volume > 0 && store.audio.volume <= 0.33) {
            return <SVGIcon source={soundLow} key="soundLow" color="white" />;
        }
        if (store.audio.volume <= 0) {
            return <SVGIcon source={mute} key="soundLow" color="white" />;
        }
    };

    return (
        <div
            className={classNames(className, {
                [style.show]:
                    store.shell.activePanel === ShellPanelType.AudioHub,
                "no-animate": !performanceMode.mode.enableAnimation,
            })}
            onAnimationStart={() => setShowBackdrop(false)}
            onAnimationEnd={() => setShowBackdrop(true)}
        >
            <BackdropWrapper active={isShowBackdrop}>
                <div className={style.container}>
                    <div className={style.content}>
                        <div className={style.icon} onClick={handleMute}>
                            {!store.audio.isMute ? (
                                getIconByVolume()
                            ) : (
                                <SVGIcon source={mute} key="soundDisable" />
                            )}
                        </div>
                        <div className={style.volume}>
                            <Slider
                                value={store.audio.volume}
                                onChange={(event, value) =>
                                    handleChangeVolume(value)
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
            </BackdropWrapper>
        </div>
    );
});
