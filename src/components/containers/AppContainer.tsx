import { AuthScreen } from "components/layout/AuthScreen/AuthScreen";
import ShellScreen from "components/layout/ShellScreen/ShellScreen";
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

    render() {
        return this.store.auth.isAuthorized ? <ShellScreen /> : <AuthScreen />;
    }
}

export default AppContainer;
