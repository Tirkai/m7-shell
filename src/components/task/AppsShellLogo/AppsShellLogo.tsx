import { Avatar } from "@material-ui/core";
import { strings } from "locale";
import React, { Component } from "react";
import { AppsMenuSidebarListItem } from "../AppsMenuSidebarListItem/AppsMenuSidebarListItem";
import style from "./style.module.css";
export class AppsShellLogo extends Component {
    render() {
        return (
            <AppsMenuSidebarListItem>
                <div className={style.appsShellLogo}>
                    <Avatar className={style.avatar}>
                        {strings.global.systemName}
                    </Avatar>
                </div>
            </AppsMenuSidebarListItem>
        );
    }
}
