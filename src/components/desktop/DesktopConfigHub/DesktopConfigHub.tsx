import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    ListItem,
} from "@material-ui/core";
import { Add, Clear } from "@material-ui/icons";
import classNames from "classnames";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import React, { useState } from "react";
import style from "./style.module.css";

interface IDesktopConfigHubProps {
    children?: React.ReactNode;
}

const className = style.desktopConfigHub;

export const DesktopConfigHub = observer((props: IDesktopConfigHubProps) => {
    const store = useStore();
    const [isShowAddDialog, setShowAddDialog] = useState(false);

    const handleSelectWidget = () => {
        store.desktop.setLayoutMode(true);
        setShowAddDialog(false);
    };

    const handleClose = () => {
        store.desktop.setLayoutMode(false);
        store.desktop.setEditMode(false);
    };

    return (
        <>
            <div
                className={classNames(className, {
                    [style.show]: store.desktop.isEditMode,
                })}
            >
                <div className={style.container}>
                    <div className={style.leftSide}>
                        <Button
                            color="primary"
                            startIcon={<Add />}
                            onClick={() => setShowAddDialog(true)}
                            variant="contained"
                        >
                            {/* TODO: Locale */} Добавить виджет
                        </Button>
                    </div>
                    <div className={style.rightSide}>
                        <Button onClick={handleClose}>
                            <Clear />
                        </Button>
                    </div>
                </div>
            </div>
            <Dialog
                open={isShowAddDialog}
                onClose={() => setShowAddDialog(false)}
                fullWidth
            >
                <DialogTitle>{/* TODO: Locale */} Добавить виджет</DialogTitle>
                <DialogContent>
                    <ListItem onClick={() => handleSelectWidget()} button>
                        Test Widget
                    </ListItem>
                </DialogContent>
            </Dialog>
        </>
    );
});
