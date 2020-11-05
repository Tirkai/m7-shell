import { UtilsFunctions } from "@algont/m7-utils";
import { Avatar } from "@material-ui/core";
import { DropdownMenu } from "components/controls/DropdownMenu/DropdownMenu";
import { DropdownMenuItem } from "components/controls/DropdownMenuItem/DropdownMenuItem";
import { ShellPanelType } from "enum/ShellPanelType";
import { IStore } from "interfaces/common/IStore";
import { strings } from "locale";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { Application } from "models/Application";
import React, { Component } from "react";
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
            <>
                <div className={style.appsProfilePreview}>
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
                            ...[
                                <DropdownMenuItem
                                    key="logout"
                                    onClick={this.handleLogout}
                                >
                                    {strings.startMenu.logout}
                                </DropdownMenuItem>,
                            ],
                        ]}
                    >
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
                    </DropdownMenu>
                </div>
            </>
        );
    }
}

export default AppsProfilePreview;
