import { IconButton } from "@material-ui/core";
import { Add, Clear, MoreVert, Restore, Save } from "@material-ui/icons";
import { ShellContextMenuItem } from "components/contextMenu/ShellContextMenuItem/ShellContextMenuItem";
import { ContextMenuContext } from "contexts/ContextMenuContext";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import React, { Fragment, useContext } from "react";
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
        const {
            showMenu,
            invokeWithClose,
            getClickPointFromEvent,
            getAnchorPointFromEvent,
        } = useContext(ContextMenuContext);

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

        const handleShowMenu = (
            e: React.MouseEvent<HTMLElement, MouseEvent>,
        ) => {
            showMenu(
                getAnchorPointFromEvent(e),
                <Fragment>
                    <ShellContextMenuItem
                        icon={<Save />}
                        content={"Сохранить сессию"}
                        onClick={() =>
                            invokeWithClose(() => handleSaveUserSession())
                        }
                    />
                    <ShellContextMenuItem
                        icon={<Restore />}
                        content={"Восстановить сессию"}
                        onClick={() =>
                            invokeWithClose(() => handleRestoreUserSession())
                        }
                    />
                    <ShellContextMenuItem
                        icon={<Clear />}
                        content={"Очистить все"}
                        onClick={() => invokeWithClose(() => handleClearAll())}
                    />
                </Fragment>,
            );
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
