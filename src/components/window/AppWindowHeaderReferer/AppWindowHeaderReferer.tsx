import { SVGIcon } from "@algont/m7-ui";
import { arrowBack } from "assets/icons";
import React from "react";
import style from "./style.module.css";

interface IAppWindowHeaderRefererProps {
    onBack: () => void;
    title: string;
}

export const AppWindowHeaderReferer = (props: IAppWindowHeaderRefererProps) => (
    <div className={style.appWindowHeaderReferer} onClick={props.onBack}>
        <div className={style.icon}>
            <SVGIcon
                source={arrowBack}
                size={{ width: "16px", height: "16px" }}
                color="white"
            />
        </div>
        {/* TODO: Locale */}
        <div className={style.text}>{props.title}</div>
        <div className={style.separator} />
    </div>
);
