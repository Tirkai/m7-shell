import { UtilsFunctions } from "@algont/m7-utils";
import { Avatar } from "@material-ui/core";
import { exit } from "assets/icons";
import { ShellPanelType } from "enum/ShellPanelType";
import { IStore } from "interfaces/common/IStore";
import { strings } from "locale";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
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
        this.store.applicationManager.executeApplication(app);
    };

    handleShowDropdown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        this.store.contextMenu.showContextMenu(new Point2D(e.pageX, e.pageY), [
            ...this.props.apps.map(
                (app) =>
                    new ContextMenuItemModel({
                        icon: app.icon,
                        content: app.name,
                        onClick: () => this.handleExecuteApp(app),
                    }),
            ),
            new ContextMenuItemModel({
                icon: exit,
                content: strings.startMenu.logout,
                onClick: this.handleLogout,
            }),
        ]);
    };

    handleLogout = async () => {
        await this.store.auth.logout();
        this.store.applicationManager.destroyUserSession();
        this.store.windowManager.closeAllWindows();
        this.store.shell.setActivePanel(ShellPanelType.StartMenu);
        this.setState({ showMenu: false });
    };

    handleOpenAccountManager = () => {
        const app = this.store.applicationManager.findByKey("AccountsMe");
        if (app) {
            this.store.applicationManager.executeApplication(app);
            this.store.shell.setActivePanel(ShellPanelType.None);
        }
        this.setState({ showMenu: false });
    };

    render() {
        const userInitials = UtilsFunctions.getInitials(
            this.store.auth.userName,
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

export default AppsProfilePreview;
