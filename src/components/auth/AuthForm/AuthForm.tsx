import { KeyboardWrapper } from "@algont/m7-keyboard";
import { MarkerType, useMarker } from "@algont/m7-react-marker";
import { Button, IconButton, TextField } from "@material-ui/core";
import { Keyboard as KeyboardIcon } from "@material-ui/icons";
import { FormItem } from "components/formLayout/FormItem/FormItem";
import { strings } from "locale";
import React, { ChangeEvent, useState } from "react";
import style from "./style.module.css";

interface IAuthFormSubmitOptions {
    login: string;
    password: string;
}

interface IAuthFormProps {
    onSubmit: (options: IAuthFormSubmitOptions) => void;
}

export const AuthForm = (props: IAuthFormProps) => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const { createMemoizedMarker } = useMarker();

    const handleChangeLogin = (event: ChangeEvent<HTMLInputElement>) => {
        setLogin(event.target.value);
    };

    const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.onSubmit({
            login,
            password,
        });
    };

    return (
        <div className={style.authForm}>
            <form onSubmit={handleSubmit}>
                <FormItem>
                    <KeyboardWrapper
                        value={login}
                        onChange={(value) => setLogin(value)}
                    >
                        {(context) => (
                            <TextField
                                inputProps={{
                                    ...createMemoizedMarker(
                                        MarkerType.Element,
                                        "AuthForm.LoginInput",
                                    ),
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            tabIndex={-1}
                                            size="small"
                                            onClick={() =>
                                                context.setShowKeyboard(true)
                                            }
                                        >
                                            <KeyboardIcon />
                                        </IconButton>
                                    ),
                                }}
                                autoFocus
                                onChange={handleChangeLogin}
                                value={login}
                                label={strings.form.fields.login}
                            />
                        )}
                    </KeyboardWrapper>
                </FormItem>
                <FormItem>
                    <KeyboardWrapper
                        value={password}
                        onChange={(value) => setPassword(value)}
                        inputType="password"
                    >
                        {(context) => (
                            <TextField
                                inputProps={{
                                    ...createMemoizedMarker(
                                        MarkerType.Element,
                                        "AuthForm.PasswordInput",
                                    ),
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            tabIndex={-1}
                                            size="small"
                                            onClick={() =>
                                                context.setShowKeyboard(true)
                                            }
                                        >
                                            <KeyboardIcon />
                                        </IconButton>
                                    ),
                                }}
                                onChange={handleChangePassword}
                                value={password}
                                label={strings.form.fields.password}
                                type="password"
                            />
                        )}
                    </KeyboardWrapper>
                </FormItem>
                <FormItem>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        {...createMemoizedMarker(
                            MarkerType.Element,
                            "AuthForm.SubmitButton",
                        )}
                    >
                        {strings.actions.login}
                    </Button>
                </FormItem>
            </form>
        </div>
    );
};
