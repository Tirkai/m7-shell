import { Avatar } from "@material-ui/core";
import { strings } from "locale";
import React, { Component } from "react";
import style from "./style.module.css";
export class AppsShellLogo extends Component {
    render() {
        return (
            <div className={style.appsShellLogo}>
                <Avatar className={style.avatar}>
                    {strings.global.systemName}
                </Avatar>
            </div>
        );
    }
}
