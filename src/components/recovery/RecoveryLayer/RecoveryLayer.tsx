import { Button, IconButton, LinearProgress } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { HubBackdrop } from "components/hub/HubBackdrop/HubBackdrop";
import { PanelInformerActions } from "components/informer/PanelInformerActions/PanelInformerActions";
import { PanelInformerContent } from "components/informer/PanelInformerText/PanelInformerText";
import { TimerWrapper } from "components/timer/TimerWrapper/TimerWrapper";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import React from "react";
import style from "./style.module.css";

const className = style.recoveryLayer;

export const RecoveryLayer = observer(() => {
    const store = useStore();

    const { config } = store.config;

    const delay = config.properties.layers.recovery.dialog.delayBeforeClose;

    const handleClose = () => {
        store.panelManager.setShowRecoveryPanel(false);
    };

    const handleStartRecovery = () => {
        store.panelManager.setShowRecoveryPanel(false);
        if (store.recovery.dynamicSessionSnapshot) {
            store.recovery.startRecovery(store.recovery.dynamicSessionSnapshot);
        }
    };

    const handleDoneTimer = () => {
        store.panelManager.setShowRecoveryPanel(false);
    };

    const isShow = store.panelManager.isShowRecoveryPanel;

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
