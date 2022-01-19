import { IconButton } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { instructionInfo } from "assets/icons";
import classNames from "classnames";
import React, { Fragment, useState } from "react";
import style from "./style.module.css";

const className = style.notificationInstruction;

interface INotificationInstructionProps {
    children?: React.ReactNode;
    // title: string;
    content?: string;
    isShow: boolean;
}

const maxLength = 70;

export const NotificationInstruction = (
    props: INotificationInstructionProps,
) => {
    const [isExpand, setExpand] = useState(false);
    const content = props.content ?? "";
    const isOverflow = content?.length > maxLength;

    let title = content.slice(0, maxLength);

    if (isOverflow) {
        title = title.concat("...");
    }

    return props.isShow ? (
        <div className={classNames(className)}>
            <div className={style.container}>
                <div
                    className={style.header}
                    onClick={() => setExpand(!isExpand)}
                >
                    <div className={style.icon}>
                        <IconButton size="small">
                            <img src={instructionInfo} alt="Info" />
                        </IconButton>
                    </div>

                    <div className={style.title}>
                        {!isExpand ? title : content}
                    </div>
                    <div className={style.actions}>
                        {isOverflow && (
                            <IconButton size="small">
                                {isExpand ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        )}
                    </div>
                </div>
                {/* <div
                    className={classNames(style.content, {
                        [style.isExpand]: isExpand,
                    })}
                >
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div> */}
            </div>
        </div>
    ) : (
        <Fragment />
    );
};
