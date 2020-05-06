import { cross, videocam } from "assets/icons";
import React, { Component } from "react";
import style from "./style.module.css";

export class AppWindowHeader extends Component {
    render() {
        return (
            <div className={style.appWindowHeader}>
                <div className={style.container}>
                    <div className={style.info}>
                        <div className={style.icon}>
                            <img src={videocam} />
                        </div>
                        <div className={style.title}>АССаД-Видео</div>
                    </div>
                    <div className={style.actions}>
                        <div className={style.actionItem}>
                            <img src={cross} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AppWindowHeader;
