import { Alert } from "@material-ui/lab";
import logo from "assets/images/logo.svg";
import classNames from "classnames";
import { AuthForm } from "components/auth/AuthForm/AuthForm";
import { PerformanceContext } from "contexts/PerformanceContext";
import { useStore } from "hooks/useStore";
import { strings } from "locale";
import { authErrorCodes } from "locale/errorCodes";
import { observer } from "mobx-react";
import React, { useContext, useEffect, useState } from "react";
import style from "./style.module.css";

const isNight = process.env.REACT_APP_NIGHT;

export const AuthScreen: React.FC = observer(() => {
    const store = useStore();
    const performanceMode = useContext(PerformanceContext);

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

    return (
        <div className={style.authScreen}>
            <div
                className={classNames(style.overlay, {
                    "no-animate": !performanceMode.mode.enableAnimation,
                })}
            >
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
                {isNight && (
                    <Alert variant="filled" severity="info">
                        Experemental Build
                    </Alert>
                )}
            </div>
        </div>
    );
});
