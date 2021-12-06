import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { Instruction } from "models/instruction/Instruction";
import React from "react";
import ReactMarkdown from "react-markdown";
import style from "./style.module.css";

interface IInstructionDialogProps {
    show: boolean;
    instruction: Instruction | null;
    onClose: () => void;
    onConfirm: (id: string) => void;
}

export const InstructionDialog = (props: IInstructionDialogProps) => {
    const handleConfirm = () => {
        // alert("CONFIRM");
        // store.notification.confirmUserNotifications();
        if (props.instruction) {
            props.onConfirm(props.instruction.notificationId);
        }
    };

    return (
        <Dialog open={props.show} onClose={() => props.onClose()} fullWidth>
            <DialogTitle classes={{ root: style.title }} disableTypography>
                <Typography variant="h5">Инструкция</Typography>
                <IconButton onClick={() => props.onClose()} size="small">
                    <Clear />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <ReactMarkdown>
                    {props.instruction?.instructionContent ?? ""}
                </ReactMarkdown>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    onClick={handleConfirm}
                >
                    Подтвердить
                </Button>
            </DialogActions>
        </Dialog>
    );
};
