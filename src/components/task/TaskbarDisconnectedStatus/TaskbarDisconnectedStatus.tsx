import { SVGIcon } from "@algont/m7-ui";
import { disconnect } from "assets/icons";
import React from "react";
import style from "./style.module.css";
export const TaskbarDisconnectedStatus = () => (
    <div className={style.disconnectedStatus}>
        <SVGIcon
            size={{ width: "24px", height: "24  px" }}
            color="white"
            source={disconnect}
        />
    </div>
);
