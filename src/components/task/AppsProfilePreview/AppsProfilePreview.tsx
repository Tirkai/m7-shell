import { Avatar } from "@material-ui/core";
import { DropdownMenu } from "components/controls/DropdownMenu/DropdownMenu";
import { DropdownMenuItem } from "components/controls/DropdownMenuItem/DropdownMenuItem";
import { ShellPanelType } from "enum/ShellPanelType";
import { IStore } from "interfaces/common/IStore";
import { strings } from "locale";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { getInitials } from "utils";
import style from "./style.module.css";

@inject("store")
@observer
export class AppsProfilePreview extends Component<IStore> {
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
        const userInitials = getInitials(this.store.auth.userName);

        return (
            <>
                <div className={style.appsProfilePreview}>
                    <DropdownMenu
                        position="bottomLeft"
                        render={[
                            <DropdownMenuItem
                                key="accounts"
                                onClick={this.handleOpenAccountManager}
                            >
                                {strings.startMenu.editAccount}
                            </DropdownMenuItem>,
                            <DropdownMenuItem
                                key="logout"
                                onClick={this.handleLogout}
                            >
                                {strings.startMenu.logout}
                            </DropdownMenuItem>,
                        ]}
                    >
                        <Avatar className={style.avatar}>{userInitials}</Avatar>
                    </DropdownMenu>
                </div>
            </>
        );
    }
}

export default AppsProfilePreview;
