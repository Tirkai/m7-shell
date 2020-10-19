import { AuthScreen } from "components/layout/AuthScreen/AuthScreen";
import { AwaitVerifyScreen } from "components/layout/AwaitVerifyScreen/AwaitVerifyScreen";
import ShellScreen from "components/layout/ShellScreen/ShellScreen";
import { MessageDialog } from "components/message/MessageDialog/MessageDialog";
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
        window.onbeforeunload = function() {
            return true;
        };
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

export default AppContainer;
