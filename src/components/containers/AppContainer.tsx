import { AuthScreen } from "components/layout/AuthScreen/AuthScreen";
import { AwaitVerifyScreen } from "components/layout/AwaitVerifyScreen/AwaitVerifyScreen";
import { ShellScreen } from "components/layout/ShellScreen/ShellScreen";
import { MessageDialog } from "components/message/MessageDialog/MessageDialog";
import { DisplayModeType } from "enum/DisplayModeType";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import "moment/locale/ru";
import React, { Component } from "react";

@inject("store")
@observer
export class AppContainer extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    componentDidMount() {
        window.addEventListener("contextmenu", (event) =>
            event.preventDefault(),
        );

        const getCloseBrowserWindowDenied = () =>
            this.store.applicationManager.executedApplications.length > 0;

        window.onbeforeunload = () => getCloseBrowserWindowDenied();

        window.addEventListener("click", (event: MouseEvent) => {
            if (this.store.contextMenu.isShow) {
                const target = event.target as HTMLDivElement;
                if (!target.closest("#context-menu")) {
                    if (this.store.contextMenu.isReady) {
                        this.store.contextMenu.hideContextmenu();
                    }
                }
            }
        });

        const urlParams = new URL(window.location.href).searchParams;
        const enableAutoRun = urlParams.get("enableAutoLogin");
        const autoLogin = urlParams.get("login");
        const autoPassword = urlParams.get("password");

        const displayMode = urlParams.get("displayMode") as DisplayModeType;

        if (!!parseInt(enableAutoRun ?? "0")) {
            if (autoLogin && autoPassword) {
                this.store.auth.login(autoLogin, autoPassword);
            } else {
                console.warn("Invalid parameters for auto login");
            }
        }

        if (displayMode) {
            this.store.shell.setDisplayMode(displayMode);
        }
    }

    render() {
        return (
            <>
                {this.store.auth.isAuthorized ? (
                    this.store.auth.checkedAfterStart ? (
                        <ShellScreen />
                    ) : (
                        <AwaitVerifyScreen />
                    )
                ) : (
                    <AuthScreen />
                )}

                <MessageDialog />
            </>
        );
    }
}
