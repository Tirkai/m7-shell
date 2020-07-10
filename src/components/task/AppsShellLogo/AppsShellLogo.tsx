import { Avatar } from "@material-ui/core";
import React, { Component } from "react";
import style from "./style.module.css";
export class AppsShellLogo extends Component {
    render() {
        return (
            <div className={style.appsShellLogo}>
                <Avatar className={style.avatar}>M7</Avatar>
            </div>
        );
    }
}
