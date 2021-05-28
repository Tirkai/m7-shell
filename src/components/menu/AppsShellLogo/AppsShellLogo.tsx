import { SVGIcon } from "@algont/m7-ui";
import { Avatar } from "@material-ui/core";
import { list, settings, tiles } from "assets/icons";
import { IStore } from "interfaces/common/IStore";
import { strings } from "locale";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { Application } from "models/Application";
import { ContextMenuItemModel } from "models/ContextMenuItemModel";
import { AppsMenuViewMode } from "models/menu/AppsMenuViewMode";
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
        if (this.store.auth.isAdmin) {
            menu.push(
                new ContextMenuItemModel({
                    icon: <SVGIcon source={settings} color="white" />,
                    content: strings.startMenu.devMode,
                    onClick: () =>
                        this.store.panelManager.setDevMode(
                            !this.store.panelManager.enabledDevMode,
                        ),
                }),
            );
        }

        if (
            this.store.panelManager.appsMenuViewMode === AppsMenuViewMode.Grid
        ) {
            menu.push(
                new ContextMenuItemModel({
                    icon: <SVGIcon source={tiles} color="white" />,
                    content: "Режим отображения: Cетка",
                    onClick: () =>
                        this.store.panelManager.setAppsMenuViewMode(
                            AppsMenuViewMode.List,
                        ),
                }),
            );
        }

        if (
            this.store.panelManager.appsMenuViewMode === AppsMenuViewMode.List
        ) {
            menu.push(
                new ContextMenuItemModel({
                    icon: <SVGIcon source={list} color="white" />,
                    content: "Режим отображения: Список",
                    onClick: () =>
                        this.store.panelManager.setAppsMenuViewMode(
                            AppsMenuViewMode.Grid,
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
