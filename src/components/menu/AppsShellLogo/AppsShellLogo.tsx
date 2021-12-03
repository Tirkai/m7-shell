import { SVGIcon } from "@algont/m7-ui";
import { Avatar } from "@material-ui/core";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { Application } from "models/app/Application";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { ContextMenuItemModel } from "models/contextMenu/ContextMenuItemModel";
import { Point2D } from "models/shape/Point2D";
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
        new ApplicationRunner(this.store).run(app, {
            focusWindowAfterInstantiate: true,
        });
    };

    handleShowDropdown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const menu = this.props.apps
            .filter((app) => !app.isOnlyAdmin || this.store.auth.isAdmin)
            .map(
                (app) =>
                    new ContextMenuItemModel({
                        icon: <SVGIcon source={app.icon} color="white" />,
                        content: app.name,
                        onClick: () => this.handleExecuteApp(app),
                    }),
            );

        if (menu.length) {
            this.store.contextMenu.showContextMenu(
                new Point2D(e.pageX, e.pageY),
                menu,
            );
        }
    };

    render() {
        const { config } = this.store.config;
        return (
            <AppsMenuSidebarListItem onClick={this.handleShowDropdown}>
                <div className={style.appsShellLogo}>
                    <Avatar className={style.avatar}>
                        <img
                            src={
                                config.properties.layers.appsMenu.platformMenu
                                    .logo.url
                            }
                        />
                    </Avatar>
                </div>
            </AppsMenuSidebarListItem>
        );
    }
}
