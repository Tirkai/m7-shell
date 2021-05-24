import { Button, IconButton } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { HubBackdrop } from "components/hub/HubBackdrop/HubBackdrop";
import { PanelInformerActions } from "components/informer/PanelInformerActions/PanelInformerActions";
import { PanelInformerContent } from "components/informer/PanelInformerText/PanelInformerText";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import style from "./style.module.css";

const className = style.recoveryLayer;

export const RecoveryLayer = observer(() => {
    const store = useStore();

    const handleClose = () => {
        store.panelManager.setShowRecoveryPanel(false);
    };

    const handleStartRecovery = () => {
        store.panelManager.setShowRecoveryPanel(false);
        if (store.recovery.dynamicSessionSnapshot) {
            store.recovery.startRecovery(store.recovery.dynamicSessionSnapshot);
        }
    };

    useEffect(() => {
        const showTimeout = 30000;

        if (store.panelManager.isShowRecoveryPanel) {
            const timer = setTimeout(() => {
                store.panelManager.setShowRecoveryPanel(false);
            }, showTimeout);
            return () => clearTimeout(timer);
        }
    }, [store.panelManager.isShowRecoveryPanel]);

    return store.panelManager.isShowRecoveryPanel ? (
        <div className={className}>
            <div className={style.informer}>
                <HubBackdrop>
                    <div className={style.header}>
                        <div className={style.title}>
                            <PanelInformerContent>
                                Восстановить сессию?
                            </PanelInformerContent>
                        </div>
                        <div className={style.actions}>
                            <IconButton size="small" onClick={handleClose}>
                                <Clear />
                            </IconButton>
                        </div>
                    </div>
                    <div className={style.content}>
                        <PanelInformerContent>
                            {`Будет восстановлено 
                            ${store.recovery.dynamicSessionSnapshot?.processSnapshot.processes.length}
                            приложений`}
                        </PanelInformerContent>
                        <PanelInformerActions>
                            <Button
                                color="secondary"
                                variant="contained"
                                onClick={handleStartRecovery}
                            >
                                Восстановить
                            </Button>
                        </PanelInformerActions>
                    </div>
                </HubBackdrop>
            </div>
        </div>
    ) : (
        <></>
    );
});
