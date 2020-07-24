import { Alert } from "@material-ui/lab";
import logo from "assets/images/logo.svg";
import { AuthForm } from "components/auth/AuthForm/AuthForm";
import { IStore } from "interfaces/common/IStore";
import { strings } from "locale";
import { authErrorCodes } from "locale/errorCodes";
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

    state = {
        isShowNotify: false,
        notifyText: "",
    };

    handleShowNotify = (value: boolean) => {
        this.setState({ isShowNotify: value });
    };

    notifyTimeout: NodeJS.Timeout | null = null;

    handleLogin = async (form: { login: string; password: string }) => {
        const data = await this.store.auth.login(form.login, form.password);

        if (data?.error) {
            const errorKey = authErrorCodes.get(data.error.code.toString());
            const errorLocaleStrings = strings.auth as any;

            this.setState({
                isShowNotify: true,
                notifyText: errorKey?.length
                    ? errorLocaleStrings[errorKey]
                    : strings.auth.authenticateError,
            });

            this.notifyTimeout = setTimeout(() => {
                this.setState({
                    isShowNotify: false,
                });
            }, 3000);
        }
    };

    componentWillUnmount() {
        if (this.notifyTimeout) {
            clearTimeout(this.notifyTimeout);
        }
    }

    render() {
        return (
            <div className={style.authScreen}>
                <div className={style.overlay}>
                    <div className={style.container}>
                        <div className={style.logo}>
                            <img src={logo} alt="Logo" />
                        </div>
                        <div className={style.description}>
                            {strings.auth.description}
                        </div>
                        <div className={style.content}>
                            <AuthForm onSubmit={this.handleLogin} />
                            {this.state.isShowNotify ? (
                                <Alert variant="filled" severity="error">
                                    {this.state.notifyText}
                                </Alert>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
