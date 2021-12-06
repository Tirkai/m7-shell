import { SVGIcon } from "@algont/m7-ui";
import { Warning } from "@material-ui/icons";
import { notifications } from "assets/icons";
import classNames from "classnames";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { NotificationTab } from "models/notification/NotificationTab";
import React from "react";
import { NotificationCategoryTabControl } from "../NotificationCategoryTabControl/NotificationCategoryTabControl";
import { NotificationCategoryTabs } from "../NotificationCategoryTabs/NotificationCategoryTabs";
import style from "./style.module.css";

const className = style.notificationHubHeader;

export const NotificationHubHeader = observer(() => {
    const store = useStore();

    return (
        <div className={classNames(className)}>
            <div className={style.container}>
                <div className={style.tabs}>
                    <NotificationCategoryTabs>
                        <NotificationCategoryTabControl
                            icon={
                                <SVGIcon
                                    source={notifications}
                                    size={{ width: "16px", height: "16px" }}
                                    color="white"
                                />
                            }
                            label={"Все уведомления"}
                            active={
                                store.notification.tab === NotificationTab.All
                            }
                            onClick={() =>
                                store.notification.setTab(NotificationTab.All)
                            }
                        />
                        <NotificationCategoryTabControl
                            icon={<Warning />}
                            label={"На подтверждение"}
                            active={
                                store.notification.tab ===
                                NotificationTab.Important
                            }
                            onClick={() =>
                                store.notification.setTab(
                                    NotificationTab.Important,
                                )
                            }
                        />
                    </NotificationCategoryTabs>
                </div>
            </div>
        </div>
    );
});
