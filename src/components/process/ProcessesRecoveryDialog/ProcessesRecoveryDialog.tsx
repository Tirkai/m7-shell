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
import React from "react";
import style from "./style.module.css";

interface IProcessesRecoveryDialogProps {
    show: boolean;
    onRecovery: () => void;
    onCancel: () => void;
    processes: IApplicationProcess[];
}

export const ProcessesRecoveryDialog = (
    props: IProcessesRecoveryDialogProps,
) => (
    <Dialog open={props.show} fullWidth onClose={() => props.onCancel()}>
        {/* TODO: Locale */}
        <DialogTitle>Восстановить предыдущую сессию?</DialogTitle>
        <DialogContent>
            Будет восстановлено {props.processes.length} приложений:
            <List>
                {props.processes.map((item) => (
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
            <Button
                onClick={() => props.onRecovery()}
                color="primary"
                variant="contained"
            >
                Да
            </Button>
            <Button onClick={() => props.onCancel()}>Нет</Button>
        </DialogActions>
    </Dialog>
);
