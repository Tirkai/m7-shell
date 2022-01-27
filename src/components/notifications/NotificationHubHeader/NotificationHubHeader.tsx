import classNames from "classnames";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { NotificationCategoryType } from "models/notification/NotificationCategoryType";
import React, { Fragment } from "react";
import { NotificationCategoryTabControl } from "../NotificationCategoryTabControl/NotificationCategoryTabControl";
import { NotificationCategoryTabs } from "../NotificationCategoryTabs/NotificationCategoryTabs";
import style from "./style.module.css";

const className = style.notificationHubHeader;

interface INotificationHubHeaderProps {
    currentTab: NotificationCategoryType;
    onSelectTab: (tab: NotificationCategoryType) => void;
}

export const NotificationHubHeader = observer(
    (props: INotificationHubHeaderProps) => {
        const store = useStore();

        const items = Array.from(store.notification.categories).map(
            ([_key, value]) => value,
        );

        return (
            <div className={classNames(className)}>
                <div className={style.container}>
                    <div className={style.tabs}>
                        <NotificationCategoryTabs>
                            {items.map((item) => (
                                <NotificationCategoryTabControl
                                    icon={
                                        // <SVGIcon
                                        //     source={notifications}
                                        //     size={{
                                        //         width: "16px",
                                        //         height: "16px",
                                        //     }}
                                        //     color="white"
                                        // />
                                        <Fragment />
                                    }
                                    label={item.name}
                                    active={props.currentTab === item.type}
                                    onClick={() => props.onSelectTab(item.type)}
                                />
                            ))}
                        </NotificationCategoryTabs>
                    </div>
                </div>
            </div>
        );
    },
);
