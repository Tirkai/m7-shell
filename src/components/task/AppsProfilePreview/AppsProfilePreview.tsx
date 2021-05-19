import { SVGIcon } from "@algont/m7-ui";
import { UtilsFunctions } from "@algont/m7-utils";
import { Avatar } from "@material-ui/core";
import { exit } from "assets/icons";
import { IStore } from "interfaces/common/IStore";
import { strings } from "locale";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { Application } from "models/Application";
import { ContextMenuItemModel } from "models/ContextMenuItemModel";
import { Point2D } from "models/Point2D";
import React, { Component } from "react";
import { AppsMenuSidebarListItem } from "../AppsMenuSidebarListItem/AppsMenuSidebarListItem";
import style from "./style.module.css";

interface IAppsProfilePreviewProps extends IStore {
    apps: Application[];
}

@inject("store")
@observer
export class AppsProfilePreview extends Component<IAppsProfilePreviewProps> {
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
        this.store.contextMenu.showContextMenu(new Point2D(e.pageX, e.pageY), [
            ...this.props.apps.map(
                (app) =>
                    new ContextMenuItemModel({
                        icon: <SVGIcon source={app.icon} color="white" />,
                        content: app.name,
                        onClick: () => this.handleExecuteApp(app),
                    }),
            ),
            new ContextMenuItemModel({
                icon: <SVGIcon source={exit} color="white" />,
                content: strings.startMenu.logout,
                onClick: this.handleLogout,
            }),
        ]);
    };

    handleLogout = () => {
        this.setState({ showMenu: false });
        this.store.auth.logout();
    };

    render() {
        const userInitials = UtilsFunctions.getInitials(
            this.store.user.userName,
        );

        return (
            <AppsMenuSidebarListItem onClick={this.handleShowDropdown}>
                <div className={style.appsProfilePreview}>
                    <Avatar
                        style={{
                            background: `linear-gradient(-45deg, ${UtilsFunctions.stringToHslColor(
                                userInitials,
                                75,
                                60,
                            )}, ${UtilsFunctions.stringToHslColor(
                                userInitials,
                                75,
                                75,
                            )})`,
                        }}
                        className={style.avatar}
                    >
                        {userInitials}
                    </Avatar>
                </div>
            </AppsMenuSidebarListItem>
        );
    }
}
