import { SVGIcon } from "@algont/m7-ui";
import { list, tiles } from "assets/icons";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { AppsMenuViewMode } from "models/menu/AppsMenuViewMode";
import React from "react";
import { AppsMenuSidebarListItem } from "../AppsMenuSidebarListItem/AppsMenuSidebarListItem";
import style from "./style.module.css";

const className = style.appsMenuViewSwitcher;

export const AppsMenuViewSwitcher = observer(() => {
    const store = useStore();

    const handleChangeViewMode = (value: AppsMenuViewMode) => {
        store.panelManager.setAppsMenuViewMode(value);
    };

    return (
        <div className={className}>
            <AppsMenuSidebarListItem
                onClick={() => handleChangeViewMode(AppsMenuViewMode.Grid)}
            >
                <SVGIcon
                    source={tiles}
                    size={{ width: "24px", height: "24px" }}
                    color="white"
                />
            </AppsMenuSidebarListItem>
            <AppsMenuSidebarListItem
                onClick={() => handleChangeViewMode(AppsMenuViewMode.List)}
            >
                <SVGIcon
                    source={list}
                    size={{ width: "24px", height: "24px" }}
                    color="white"
                />
            </AppsMenuSidebarListItem>
        </div>
    );
});
