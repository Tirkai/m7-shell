import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
} from "@material-ui/core";
import { Refresh } from "@material-ui/icons";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";

export const AutoLogin = observer(() => {
    const store = useStore();
    const { config } = store.config;

    const [isShowNotify, setShowNotify] = useState(false);

    const onMount = () => {
        const urlParams = new URL(window.location.href).searchParams;

        const autoLoginEnabled =
            config.properties.autoLogin.enabled ||
            urlParams.get("enableAutoLogin") === "1";

        const loginUrlParam = urlParams.get("login");
        const passwordUrlParam = urlParams.get("password");

        if (autoLoginEnabled) {
            if (loginUrlParam && passwordUrlParam) {
                store.auth.login(loginUrlParam, passwordUrlParam);
                return;
            }

            if (
                config.properties.autoLogin.login &&
                config.properties.autoLogin.password
            ) {
                store.auth.login(
                    config.properties.autoLogin.login,
                    config.properties.autoLogin.password,
                );
            }
        }

        const timeout = setTimeout(() => setShowNotify(true), 3000);
        return () => clearTimeout(timeout);
    };

    const handleReload = () => window.location.reload();

    useEffect(onMount, []);

    return isShowNotify ? (
        <Dialog open={true} fullWidth>
            <DialogContent>
                Для повторного входа в систему обновите сессию
            </DialogContent>
            <DialogActions>
                <Button
                    startIcon={<Refresh />}
                    color="primary"
                    variant="contained"
                    onClick={handleReload}
                >
                    Обновить
                </Button>
            </DialogActions>
        </Dialog>
    ) : (
        <></>
    );
});
