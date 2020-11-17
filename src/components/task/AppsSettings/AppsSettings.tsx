import { SVGIcon } from "@algont/m7-ui";
import { settings } from "assets/icons";
import { DropdownMenu } from "components/controls/DropdownMenu/DropdownMenu";
import { DropdownMenuItem } from "components/controls/DropdownMenuItem/DropdownMenuItem";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { Application } from "models/Application";
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
    render() {
        if (this.props.apps.length) {
            return (
                <DropdownMenu
                    position="bottomLeft"
                    render={[
                        ...this.props.apps.map((app) => (
                            <DropdownMenuItem
                                key={app.id}
                                onClick={async () =>
                                    this.store.applicationManager.executeApplication(
                                        app,
                                    )
                                }
                            >
                                {app.name}
                            </DropdownMenuItem>
                        )),
                    ]}
                >
                    <AppsMenuSidebarListItem>
                        <SVGIcon
                            source={settings}
                            size={{
                                width: "24px",
                                height: "24px",
                            }}
                            color="white"
                        />
                    </AppsMenuSidebarListItem>
                </DropdownMenu>
            );
        } else {
            return "";
        }
    }
}
