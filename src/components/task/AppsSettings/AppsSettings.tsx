import { SVGIcon } from "@algont/m7-ui";
import { settings } from "assets/icons";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { Application } from "models/Application";
import { ContextMenuItemModel } from "models/ContextMenuItemModel";
import { Point2D } from "models/Point2D";
import React, { Component } from "react";
import { AppsMenuSidebarListItem } from "../AppsMenuSidebarListItem/AppsMenuSidebarListItem";
import style from "./style.module.css";

const className = style.appsSettings;

interface IAppsSettingsProps extends IStore {
    apps: Application[];
}

@inject("store")
@observer
export class AppsSettings extends Component<IAppsSettingsProps> {
    @computed
    get store() {
        return this.props.store!;
    }

    handleExecuteApp = (app: Application) => {
        new ApplicationRunner(this.store).run(app);
    };

    handleShowDropdown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const x = e.pageX;
        const y = e.pageY;

        this.store.contextMenu.showContextMenu(
            new Point2D(x, y),
            this.props.apps.map(
                (app) =>
                    new ContextMenuItemModel({
                        icon: app.icon,
                        content: app.name,
                        onClick: () => this.handleExecuteApp(app),
                    }),
            ),
        );
    };

    render() {
        if (this.props.apps.length) {
            return (
                <AppsMenuSidebarListItem
                    onClick={(e) => this.handleShowDropdown(e)}
                >
                    <SVGIcon
                        source={settings}
                        size={{
                            width: "24px",
                            height: "24px",
                        }}
                        color="white"
                    />
                </AppsMenuSidebarListItem>
            );
        } else {
            return "";
        }
    }
}
