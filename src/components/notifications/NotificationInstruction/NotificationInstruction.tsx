import { IconButton } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { instructionInfo } from "assets/icons";
import classNames from "classnames";
import React, { Fragment, useState } from "react";
import ReactMarkdown from "react-markdown";
import style from "./style.module.css";

const className = style.notificationInstruction;

interface INotificationInstructionProps {
    children?: React.ReactNode;
    title: string;
    content: string;
    isShow: boolean;
}

export const NotificationInstruction = (
    props: INotificationInstructionProps,
) => {
    const [isExpand, setExpand] = useState(false);

    return props.isShow ? (
        <div className={classNames(className)}>
            <div className={style.container}>
                <div
                    className={style.header}
                    onClick={() => setExpand(!isExpand)}
                >
                    <div className={style.icon}>
                        <img src={instructionInfo} />
                    </div>
                    <div className={style.title}>{props.title}</div>
                    <div className={style.actions}>
                        <IconButton size="small">
                            {isExpand ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </div>
                </div>
                <div
                    className={classNames(style.content, {
                        [style.isExpand]: isExpand,
                    })}
                >
                    <ReactMarkdown>{props.content}</ReactMarkdown>
                </div>
            </div>
        </div>
    ) : (
        <Fragment />
    );
};
