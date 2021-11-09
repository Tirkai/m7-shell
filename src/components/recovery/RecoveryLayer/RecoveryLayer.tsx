import { Button, IconButton, LinearProgress } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { HubBackdrop } from "components/hub/HubBackdrop/HubBackdrop";
import { PanelInformerActions } from "components/informer/PanelInformerActions/PanelInformerActions";
import { PanelInformerContent } from "components/informer/PanelInformerText/PanelInformerText";
import { TimerWrapper } from "components/timer/TimerWrapper/TimerWrapper";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import style from "./style.module.css";

const className = style.recoveryLayer;

export const RecoveryLayer = observer(() => {
    const store = useStore();

    const { config } = store.config;

    const delay = config.properties.layers.recovery.dialog.delayBeforeClose;

    const handleClose = () => {
        store.panelManager.setShowRecoveryPanel(false);
        // store.recovery.setIsRecoveredDynamicSnapshot(true);
    };

    const handleStartRecovery = () => {
        store.panelManager.setShowRecoveryPanel(false);
        if (store.recovery.dynamicSessionSnapshot) {
            // store.recovery.setIsRecoveredDynamicSnapshot(true);
            store.recovery.startRecovery(store.recovery.dynamicSessionSnapshot);
        }
    };

    const onShowRecoveryPanel = () => {
        // const delay =
        //     store.config.config.properties.layers.recovery.dialog
        //         .delayBeforeClose;
        // if (store.panelManager.isShowRecoveryPanel) {
        //     const timer = setTimeout(() => {
        //         store.panelManager.setShowRecoveryPanel(false);
        //         // store.recovery.setIsRecoveredDynamicSnapshot(true);
        //     }, delay);
        //     return () => clearTimeout(timer);
        // }
    };

    const handleDoneTimer = () => {
        store.panelManager.setShowRecoveryPanel(false);
    };

    useEffect(onShowRecoveryPanel, [store.panelManager.isShowRecoveryPanel]);

    const isShow = store.panelManager.isShowRecoveryPanel;
    // const isShow = true;

    return isShow ? (
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
                    <div className={style.progress}>
                        <TimerWrapper
                            direction="backward"
                            ms={delay}
                            onDone={() => handleDoneTimer()}
                            checkInterval={300}
                        >
                            {({ progress }) => (
                                <LinearProgress
                                    classes={{ root: style.progressBar }}
                                    variant="determinate"
                                    value={progress}
                                />
                            )}
                        </TimerWrapper>
                    </div>
                </HubBackdrop>
            </div>
        </div>
    ) : (
        <></>
    );
});
