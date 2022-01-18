import { SVGIcon } from "@algont/m7-ui";
import { notifications } from "assets/icons";
import React from "react";
import style from "./style.module.css";
export const NotificationBell = () => {
    return (
        <div className={style.notificationBell}>
            <div className={style.animator}>
                <SVGIcon
                    source={notifications}
                    size={{ width: "32px", height: "32px" }}
                />
            </div>
        </div>
    );
};
