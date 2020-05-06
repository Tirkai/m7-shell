import TaskBar from "components/task/TaskBar/TaskBar";
import { AppWindow } from "components/window/AppWindow/AppWindow";
import React, { Component } from "react";
import style from "./style.module.css";

export class ShellScreen extends Component {
    render() {
        return (
            <div className={style.shellScreen}>
                <AppWindow />
                <TaskBar />
            </div>
        );
    }
}

export default ShellScreen;
