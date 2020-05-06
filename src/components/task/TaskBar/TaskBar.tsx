import { apps, videocam } from "assets/icons";
import React, { Component } from "react";
import { TaskBarItem } from "../TaskBarItem/TaskBarItem";
import style from "./style.module.css";

export class TaskBar extends Component {
    render() {
        return (
            <div className={style.taskBar}>
                <TaskBarItem>
                    <img src={apps} />
                </TaskBarItem>
                <TaskBarItem executed>
                    <img src={videocam} />
                </TaskBarItem>
            </div>
        );
    }
}

export default TaskBar;
