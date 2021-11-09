import { SVGIcon } from "@algont/m7-ui";
import classNames from "classnames";
import React from "react";
import style from "./style.module.css";

interface IAppWindowHeaderTitleProps {
    title: string;
    icon: string;
    onIconClick: (e: React.MouseEvent) => void;
}

export const AppWindowHeaderTitle = (props: IAppWindowHeaderTitleProps) => (
    <div className={style.appWindowHeaderTitle}>
        <div className={style.icon} onClick={props.onIconClick}>
            <SVGIcon
                source={props.icon}
                size={{ width: "16px", height: "16px" }}
                color="#ffffff"
            />
        </div>
        <div className={classNames("appHeaderInfoBar", style.title)}>
            {props.title}
        </div>
    </div>
);
