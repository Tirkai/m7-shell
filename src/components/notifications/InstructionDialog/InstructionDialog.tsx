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
import React from "react";
import ReactMarkdown from "react-markdown";
import style from "./style.module.css";

const className = style.instructionDialog;

interface IInstructionDialogProps {
    text: string;
    open: boolean;
    onClose: () => void;
}

export const InstructionDialog = (props: IInstructionDialogProps) => {
    return (
        <Dialog open={props.open} onClose={() => props.onClose()} fullWidth>
            <DialogTitle classes={{ root: style.title }} disableTypography>
                <Typography variant="h5">Инструкция</Typography>
                <IconButton onClick={() => props.onClose()} size="small">
                    <Clear />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <ReactMarkdown>{props.text}</ReactMarkdown>
            </DialogContent>
            <DialogActions>
                <Button color="primary" variant="contained" size="large">
                    Подтвердить
                </Button>
            </DialogActions>
        </Dialog>
    );
};
