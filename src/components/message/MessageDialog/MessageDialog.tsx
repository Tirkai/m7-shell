import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";

@inject("store")
@observer
export class MessageDialog extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    handleCloseMessage = () => {
        this.store.message.hideMessage();
    };

    render() {
        return (
            <Dialog
                open={this.store.message.isShowMessage}
                fullWidth
                onClose={() => this.handleCloseMessage()}
            >
                <DialogTitle>{this.store.message.title}</DialogTitle>
                <DialogContent>{this.store.message.message}</DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        color="primary"
                        variant="contained"
                        onClick={() => this.handleCloseMessage()}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}
