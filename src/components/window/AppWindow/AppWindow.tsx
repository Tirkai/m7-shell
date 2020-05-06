import React, { Component } from "react";
import Draggable from "react-draggable";
import AppWindowHeader from "../AppWindowHeader/AppWindowHeader";
import style from "./style.module.css";
export class AppWindow extends Component {
    render() {
        return (
            <Draggable>
                <div className={style.appWindow}>
                    <AppWindowHeader />
                    <iframe
                        src="http://video.test1/lab/setup"
                        style={{ width: "100%", height: "100%" }}
                        frameBorder={0}
                    ></iframe>
                </div>
            </Draggable>
        );
    }
}
