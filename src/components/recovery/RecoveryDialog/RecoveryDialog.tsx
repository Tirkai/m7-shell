import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import { ISnapshotApplicationProcess } from "models/process/ISnapshotApplicationProcess";
import { IVirtualViewportTemplate } from "models/virtual/IVirtualViewportTemplate";
import React from "react";

interface IRecoveryDialogProps {
    show: boolean;
    onRecovery: () => void;
    onCancel: () => void;
    onRestart: () => void;
    processes?: ISnapshotApplicationProcess[];
    viewports?: IVirtualViewportTemplate[];
}

export const RecoveryDialog = (props: IRecoveryDialogProps) => (
    <Dialog open={props.show} fullWidth onClose={() => props.onCancel()}>
        {/* TODO: Locale */}
        <DialogTitle>Восстановить предыдущую сессию?</DialogTitle>
        <DialogContent>
            <span>Будет восстановлено </span>
            {(props.processes?.length ?? 0) > 0
                ? `${props.processes?.length} приложений и `
                : ""}

            {(props.viewports?.length ?? 0) > 0
                ? `${props.viewports?.length} рабочий(их) столов`
                : ""}
        </DialogContent>
        <DialogActions>
            <Button onClick={() => props.onRestart()} color="primary">
                Начать сначала
            </Button>
            <Button onClick={() => props.onRecovery()} color="primary">
                Восстановить
            </Button>
        </DialogActions>
    </Dialog>
);
