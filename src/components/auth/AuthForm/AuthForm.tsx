import { MarkerType, useMarker } from "@algont/m7-react-marker";
import { Button, TextField } from "@material-ui/core";
import { FormItem } from "components/formLayout/FormItem/FormItem";
import { strings } from "locale";
import React, { ChangeEvent, useState } from "react";
import style from "./style.module.css";

interface IAuthFormProps {
    onSubmit: (form: { login: string; password: string }) => void;
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
                    <TextField
                        inputProps={{
                            ...createMemoizedMarker(
                                MarkerType.Element,
                                "AuthFormLoginInput",
                            ),
                        }}
                        autoFocus
                        onChange={handleChangeLogin}
                        value={login}
                        label={strings.form.fields.login}
                    />
                </FormItem>
                <FormItem>
                    <TextField
                        inputProps={{
                            ...createMemoizedMarker(
                                MarkerType.Element,
                                "AuthFormPasswordInput",
                            ),
                        }}
                        onChange={handleChangePassword}
                        value={password}
                        label={strings.form.fields.password}
                        type="password"
                    />
                </FormItem>
                <FormItem>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        {...createMemoizedMarker(
                            MarkerType.Element,
                            "AuthFormSubmitButton",
                        )}
                    >
                        {strings.actions.login}
                    </Button>
                </FormItem>
            </form>
        </div>
    );
};
