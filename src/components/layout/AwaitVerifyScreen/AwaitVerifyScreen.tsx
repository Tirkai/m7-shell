import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import { useStore } from "hooks/useStore";
import { strings } from "locale";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import style from "./style.module.css";

export const AwaitVerifyScreen: React.FC = observer(() => {
    const store = useStore();
    const [isShow, setShow] = useState(false);

    const handleLogout = async () => store.auth.logout();

    useEffect(() => {
        const timeout = setTimeout(() => setShow(true), 3000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <Dialog open={isShow} onClose={() => setShow(false)} fullWidth>
            <DialogTitle>
                <div className={style.header}>
                    <div className={style.preloader}>
                        <CircularProgress size={20} />
                    </div>
                    <div className={style.title}>
                        {strings.state.sessionRecovery.title}
                    </div>
                </div>
            </DialogTitle>
            <DialogContent>
                {strings.state.sessionRecovery.content}
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleLogout}
                >
                    {strings.auth.action.logout}
                </Button>
            </DialogActions>
        </Dialog>
    );
});
