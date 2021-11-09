import { IconButton } from "@material-ui/core";
import { Add, Clear, MoreVert, Restore, Save } from "@material-ui/icons";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { ContextMenuItemModel } from "models/contextMenu/ContextMenuItemModel";
import { Point2D } from "models/shape/Point2D";
import React from "react";
import { VirtualFramePreviewBase } from "../VirtualFramePreviewBase/VirtualFramePreviewBase";
import { VirtualFramePreviewLayout } from "../VirtualFramePreviewLayout/VirtualFramePreviewLayout";
import style from "./style.module.css";

interface IVirtualFrameActionsProps {
    onAdd: () => void;
}

const className = style.virtualFrameActions;

export const VirtualFrameActions = observer(
    (props: IVirtualFrameActionsProps) => {
        const store = useStore();

        const handleSaveUserSession = () => {
            store.recovery.saveFreezeSnapshot();
        };

        const handleRestoreUserSession = () => {
            const snapshot = store.recovery.freezedSessionSnapshot;
            if (snapshot) {
                store.recovery.startRecovery(snapshot);
            }
        };

        const handleClearAll = () => {
            store.processManager.resetProcesses();
            store.virtualViewport.resetViewports({ atLeastOne: true });
        };

        const handleShowMenu = (e: React.MouseEvent) => {
            const x = e.pageX;
            const y = e.pageY;

            store.contextMenu.showContextMenu(new Point2D(x, y), [
                new ContextMenuItemModel({
                    icon: <Save />,
                    content: "Сохранить сессию",
                    onClick: () => handleSaveUserSession(),
                }),
                new ContextMenuItemModel({
                    icon: <Restore />,
                    content: "Восстановить сессию",
                    onClick: () => handleRestoreUserSession(),
                }),
                new ContextMenuItemModel({
                    icon: <Clear />,
                    content: "Очистить все",
                    onClick: () => handleClearAll(),
                }),
            ]);
        };

        return (
            <div className={className}>
                <VirtualFramePreviewLayout
                    header={
                        <div className={style.headerActions}>
                            <IconButton
                                size="small"
                                color="secondary"
                                onClick={handleShowMenu}
                            >
                                <MoreVert />
                            </IconButton>
                        </div>
                    }
                    content={
                        <VirtualFramePreviewBase
                            color="light"
                            onClick={props.onAdd}
                        >
                            <div className={style.addAction}>
                                <Add />
                            </div>
                        </VirtualFramePreviewBase>
                    }
                />
            </div>
        );
    },
);
