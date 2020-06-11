import { Avatar, Menu, MenuItem } from "@material-ui/core";
import avatar from "assets/images/avatar.png";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import style from "./style.module.css";

@inject("store")
@observer
export class AppsProfilePreview extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    state = {
        menuAnchor: null,
        showMenu: false,
    };

    handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        this.setState({ menuAnchor: event.target, showMenu: true });
    };

    handleShowMenu = (value: boolean) => {
        this.setState({ showMenu: value });
    };

    handleLogout = async () => {
        await this.store.auth.logout();
        this.store.applicationManager.destroyUserSession();
        this.store.windowManager.closeAllWindows();
        this.store.shell.setAppMenuShow(false);
        this.setState({ showMenu: false });
    };

    handleOpenAccountManager = () => {
        const app = this.store.applicationManager.findByKey("AccountsMe");
        if (app) {
            this.store.applicationManager.executeApplication(app);
            this.store.shell.setAppMenuShow(false);
        }
        this.setState({ showMenu: false });
    };

    render() {
        return (
            <>
                <div className={style.appsProfilePreview}>
                    <Avatar src={avatar} onClick={this.handleClick} />
                </div>
                <Menu
                    open={this.state.showMenu}
                    anchorEl={this.state.menuAnchor}
                    onClose={() => this.handleShowMenu(false)}
                >
                    <MenuItem onClick={this.handleOpenAccountManager}>
                        Настройки аккаунта
                    </MenuItem>
                    <MenuItem onClick={this.handleLogout}>Выход</MenuItem>
                </Menu>
            </>
        );
    }
}

export default AppsProfilePreview;
