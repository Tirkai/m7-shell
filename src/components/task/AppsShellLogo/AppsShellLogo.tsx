import { Avatar } from "@material-ui/core";
import { settings } from "assets/icons";
import { IStore } from "interfaces/common/IStore";
import { strings } from "locale";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { Application } from "models/Application";
import { ApplicationProcess } from "models/ApplicationProcess";
import { ApplicationWindow } from "models/ApplicationWindow";
import { ContextMenuItemModel } from "models/ContextMenuItemModel";
import { Point2D } from "models/Point2D";
import React, { Component } from "react";
import { AppsMenuSidebarListItem } from "../AppsMenuSidebarListItem/AppsMenuSidebarListItem";
import style from "./style.module.css";

interface IAppsShellLogoProps extends IStore {
    apps: Application[];
}

@inject("store")
@observer
export class AppsShellLogo extends Component<IAppsShellLogoProps> {
    @computed
    get store() {
        return this.props.store!;
    }

    handleExecuteApp = (app: Application) => {
        this.store.processManager.execute(
            new ApplicationProcess({
                app,
                window: new ApplicationWindow(),
            }),
        );
    };

    handleShowDropdown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const menu = this.props.apps
            .filter((app) => !app.isOnlyAdmin || this.store.auth.isAdmin)
            .map(
                (app) =>
                    new ContextMenuItemModel({
                        icon: app.icon,
                        content: app.name,
                        onClick: () => this.handleExecuteApp(app),
                    }),
            );
        if (this.store.auth.isAdmin) {
            menu.push(
                new ContextMenuItemModel({
                    icon: settings,
                    content: strings.startMenu.devMode,
                    onClick: () =>
                        this.store.shell.setDevMode(
                            !this.store.shell.enabledDevMode,
                        ),
                }),
            );
        }

        if (menu.length) {
            this.store.contextMenu.showContextMenu(
                new Point2D(e.pageX, e.pageY),
                menu,
            );
        }
    };

    render() {
        return (
            <AppsMenuSidebarListItem onClick={this.handleShowDropdown}>
                <div className={style.appsShellLogo}>
                    <Avatar className={style.avatar}>
                        {strings.global.systemName}
                    </Avatar>
                </div>
            </AppsMenuSidebarListItem>
        );
    }
}
