import { Alert } from "@material-ui/lab";
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
            this.setState({
                isShowNotify: true,
                notifyText: data.error.message,
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
                <div className={style.container}>
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
        );
    }
}
