import { ButtonBase, ButtonGroup } from "@material-ui/core";
import { Clear, MoreVert } from "@material-ui/icons";
import classNames from "classnames";
import { ShellContextMenuItem } from "components/contextMenu/ShellContextMenuItem/ShellContextMenuItem";
import { ContextMenuContext } from "contexts/ContextMenuContext";
import React, { Fragment, useContext } from "react";
import style from "./style.module.css";

const className = style.notificationConfirm;

interface INotificationConfirmProps {
    isShow: boolean;
    onConfirm: () => void;
    onConfirmAndDrop: () => void;
}

export const NotificationConfirm = (props: INotificationConfirmProps) => {
    const { showMenu, transformEventAnchorToPoint, invokeWithClose } =
        useContext(ContextMenuContext);

    return props.isShow ? (
        <div className={classNames(className)}>
            <div className={style.container}>
                <ButtonGroup>
                    <ButtonBase
                        onClick={props.onConfirm}
                        classes={{
                            root: classNames(style.button, style.mainButton),
                        }}
                    >
                        Подтвердить
                    </ButtonBase>
                    <ButtonBase
                        onClick={(event) =>
                            showMenu(
                                transformEventAnchorToPoint(event),
                                <Fragment>
                                    <ShellContextMenuItem
                                        onClick={() =>
                                            invokeWithClose(() =>
                                                props.onConfirmAndDrop(),
                                            )
                                        }
                                        icon={<Clear />}
                                        content={"Подтвердить и сбросить"}
                                    />
                                </Fragment>,
                            )
                        }
                        classes={{
                            root: classNames(
                                style.button,
                                style.additionalButton,
                            ),
                        }}
                    >
                        <MoreVert />
                    </ButtonBase>
                </ButtonGroup>
            </div>
        </div>
    ) : (
        <Fragment />
    );
};
