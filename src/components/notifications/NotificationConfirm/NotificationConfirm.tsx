import { ButtonBase } from "@material-ui/core";
import classNames from "classnames";
import React, { Fragment } from "react";
import style from "./style.module.css";

const className = style.notificationConfirm;

interface INotificationConfirmProps {
    isShow: boolean;
    onConfirm: () => void;
}

export const NotificationConfirm = (props: INotificationConfirmProps) => {
    return props.isShow ? (
        <div className={classNames(className)}>
            <div className={style.container}>
                <ButtonBase
                    onClick={props.onConfirm}
                    classes={{ root: style.button }}
                >
                    Подтвердить
                </ButtonBase>
            </div>
        </div>
    ) : (
        <Fragment />
    );
};
