import { ButtonBase, ButtonGroup } from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
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
    const {
        showMenu,
        getClickPointFromEvent,
        getAnchorPointFromEvent,
        invokeWithClose,
    } = useContext(ContextMenuContext);

    const handleShowMenu = (
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => {
        // getAnchorPointFromEvent(event);

        showMenu(
            getAnchorPointFromEvent(event),
            <Fragment>
                <ShellContextMenuItem
                    onClick={() =>
                        invokeWithClose(() => props.onConfirmAndDrop())
                    }
                    content={"Подтвердить и сбросить"}
                />
            </Fragment>,
        );
    };

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
                        onClick={handleShowMenu}
                        classes={{
                            root: classNames(
                                style.button,
                                style.additionalButton,
                            ),
                        }}
                    >
                        <ArrowDropDown />
                    </ButtonBase>
                </ButtonGroup>
            </div>
        </div>
    ) : (
        <Fragment />
    );
};
