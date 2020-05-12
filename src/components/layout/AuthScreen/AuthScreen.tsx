import { AuthForm } from "components/auth/AuthForm/AuthForm";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import style from "./style.module.css";

@inject("store")
@observer
export class AuthScreen extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    handleLogin = (form: { login: string; password: string }) => {
        this.store.auth.login(form.login, form.password);
    };

    render() {
        return (
            <div className={style.authScreen}>
                <div className={style.container}>
                    <div className={style.content}>
                        <AuthForm onSubmit={this.handleLogin} />
                    </div>
                </div>
            </div>
        );
    }
}
