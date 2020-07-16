import { Button, TextField } from "@material-ui/core";
import { FormItem } from "components/formLayout/FormItem/FormItem";
import { strings } from "locale";
import React, { ChangeEvent, Component } from "react";
import style from "./style.module.css";

interface IAuthFormProps {
    onSubmit: (form: { login: string; password: string }) => void;
}

export class AuthForm extends Component<IAuthFormProps> {
    state = {
        login: "",
        password: "",
    };

    handleChangeLogin = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ login: event.target.value });
    };

    handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ password: event.target.value });
    };

    handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.onSubmit({
            login: this.state.login,
            password: this.state.password,
        });
    };

    render() {
        return (
            <div className={style.authForm}>
                <form onSubmit={this.handleSubmit}>
                    <FormItem>
                        <TextField
                            autoFocus
                            onChange={this.handleChangeLogin}
                            value={this.state.login}
                            label={strings.form.fields.login}
                        />
                    </FormItem>
                    <FormItem>
                        <TextField
                            onChange={this.handleChangePassword}
                            value={this.state.password}
                            label={strings.form.fields.password}
                            type="password"
                        />
                    </FormItem>
                    <FormItem>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            {strings.actions.login}
                        </Button>
                    </FormItem>
                </form>
            </div>
        );
    }
}
