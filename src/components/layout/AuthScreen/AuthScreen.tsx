import { Alert } from "@material-ui/lab";
import logo from "assets/images/logo.svg";
import classNames from "classnames";
import { AuthForm } from "components/auth/AuthForm/AuthForm";
import { ConfigCondition } from "components/config/ConfigCondition/ConfigCondition";
import { useStore } from "hooks/useStore";
import { strings } from "locale";
import { authErrorCodes } from "locale/errorCodes";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import style from "./style.module.css";

export const AuthScreen: React.FC = observer(() => {
    const store = useStore();

    let timeout: NodeJS.Timeout;

    const [isShowNotify, setShowNotify] = useState(false);
    const [notifyText, setNotifyText] = useState("");

    useEffect(() => () => clearTimeout(timeout), []);

    const handleLogin = async (form: { login: string; password: string }) => {
        const data = await store.auth.login(form.login, form.password);
        if (data?.error) {
            const errorKey = authErrorCodes.get(data.error.code.toString());
            const errorLocaleStrings = strings.auth.error as any;

            setShowNotify(true);
            setNotifyText(
                errorKey?.length
                    ? errorLocaleStrings[errorKey]
                    : strings.auth.error.authenticateError,
            );

            timeout = setTimeout(() => setShowNotify(false), 3000);
        }
    };

    const { config } = store.config;

    return (
        <div className={style.authScreen}>
            <ConfigCondition condition={!config["autoLogin.enabled"]}>
                <div className={classNames(style.overlay)}>
                    <div className={style.container}>
                        <div className={style.logo}>
                            <img src={logo} alt="Logo" />
                        </div>
                        <div className={style.description}>
                            {strings.auth.description}
                        </div>
                        <div className={style.content}>
                            <AuthForm onSubmit={handleLogin} />
                            {isShowNotify && (
                                <Alert variant="filled" severity="error">
                                    {notifyText}
                                </Alert>
                            )}
                        </div>
                    </div>
                </div>
            </ConfigCondition>
        </div>
    );
});
