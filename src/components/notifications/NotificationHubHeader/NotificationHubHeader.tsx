import { SVGIcon } from "@algont/m7-ui";
import { Warning } from "@material-ui/icons";
import { notifications } from "assets/icons";
import classNames from "classnames";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { NotificationTab } from "models/notification/NotificationTab";
import React from "react";
import { NotificationCategoryTab } from "../NotificationCategoryTab/NotificationCategoryTab";
import { NotificationCategoryTabs } from "../NotificationCategoryTabs/NotificationCategoryTabs";
import style from "./style.module.css";

const className = style.notificationHubHeader;

interface INotificationHubHeaderProps {
    children?: React.ReactNode;
}

export const NotificationHubHeader = observer(
    (props: INotificationHubHeaderProps) => {
        const store = useStore();

        return (
            <div className={classNames(className)}>
                <div className={style.container}>
                    <div className={style.tabs}>
                        <NotificationCategoryTabs>
                            <NotificationCategoryTab
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
                            <NotificationCategoryTab
                                icon={
                                    <SVGIcon
                                        source={notifications}
                                        size={{ width: "16px", height: "16px" }}
                                        color="white"
                                    />
                                }
                                label={"Все уведомления"}
                                active={
                                    store.notification.tab ===
                                    NotificationTab.All
                                }
                                onClick={() =>
                                    store.notification.setTab(
                                        NotificationTab.All,
                                    )
                                }
                            />
                        </NotificationCategoryTabs>
                    </div>
                </div>
            </div>
        );
    },
);
