import { IconButton } from "@material-ui/core";
import { Add, MoreHoriz, Save } from "@material-ui/icons";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { ContextMenuItemModel } from "models/ContextMenuItemModel";
import { Point2D } from "models/Point2D";
import { UserDatabasePropKey } from "models/userDatabase/UserDatabasePropKey";
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
            store.recovery.saveSnapshot(UserDatabasePropKey.FreezedSession);
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
                                <MoreHoriz />
                            </IconButton>
                        </div>
                    }
                    content={
                        <VirtualFramePreviewBase onClick={props.onAdd}>
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
