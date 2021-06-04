import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import React, { useEffect } from "react";

export const AutoLogin = observer(() => {
    const store = useStore();
    const { config } = store.config;

    useEffect(() => {
        const autoLoginEnabled = config["autoLogin.enabled"];

        if (autoLoginEnabled) {
            store.auth.login(
                config["autoLogin.login"],
                config["autoLogin.password"],
            );
        }
    }, []);

    useEffect(() => {
        const urlParams = new URL(window.location.href).searchParams;

        const enableAutoLogin = urlParams.get("enableAutoLogin");

        const autoLogin = urlParams.get("login");
        const autoPassword = urlParams.get("password");

        if (!!parseInt(enableAutoLogin ?? "0")) {
            if (autoLogin && autoPassword) {
                store.auth.login(autoLogin, autoPassword);
            } else {
                console.warn("Invalid parameters for auto login");
            }
        }
    }, []);

    return <></>;
});
