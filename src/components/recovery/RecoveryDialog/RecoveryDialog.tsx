import { SVGIcon } from "@algont/m7-ui";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@material-ui/core";
import { IApplicationProcess } from "models/process/IApplicationProcess";
import { IVirtualViewportTemplate } from "models/virtual/IVirtualViewportTemplate";
import React from "react";
import style from "./style.module.css";

interface IRecoveryDialogProps {
    show: boolean;
    onRecovery: () => void;
    onCancel: () => void;
    processes?: IApplicationProcess[];
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

            <List>
                {props.processes?.map((item) => (
                    <ListItem classes={{ gutters: style.listItem }}>
                        <ListItemAvatar>
                            <SVGIcon
                                source={item.app.icon}
                                size={{ width: "32px", height: "32px" }}
                            />
                        </ListItemAvatar>
                        <ListItemText>{item.app.name}</ListItemText>
                    </ListItem>
                ))}
            </List>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => props.onCancel()}>Начать сначала</Button>
            <Button onClick={() => props.onRecovery()} color="primary">
                Восстановить
            </Button>
        </DialogActions>
    </Dialog>
);
