import { SVGIcon } from "@algont/m7-ui";
import { empty } from "assets/icons";
import classNames from "classnames";
import { BackdropWrapper } from "components/layout/BackdropWrapper/BackdropWrapper";
import { PlaceholderWithIcon } from "components/placeholder/PlaceholderWithIcon/PlaceholderWithIcon";
import { PerformanceContext } from "contexts/PerformanceContext";
import { ShellPanelType } from "enum/ShellPanelType";
import { useStore } from "hooks/useStore";
import { strings } from "locale";
import { uniq } from "lodash";
import { observer } from "mobx-react";
import { Application } from "models/Application";
import { ExternalApplication } from "models/ExternalApplication";
import { NotificationModel } from "models/NotificationModel";
import React, { useContext, useState } from "react";
import { v4 } from "uuid";
import { NotificationCard } from "../NotificationCard/NotificationCard";
import { NotificationGroup } from "../NotificationGroup/NotificationGroup";
import style from "./style.module.css";

export const NotificationHub = observer(() => {
    const store = useStore();
    const performanceMode = useContext(PerformanceContext);
    const [isScrolled, setScrolled] = useState(false);
    const [isShowBackdrop, setShowBackdrop] = useState(false);

    const handleClearGroup = (id: string) => {
        const notifications = store.notification.notifications.filter(
            (item) => item.applicationId === id,
        );

        notifications.forEach((item) => item.setDisplayed(false));

        setTimeout(() => {
            store.notification.removeNotifications(
                notifications,
                store.auth.userLogin,
            );
        }, 300);
    };

    const handleCloseNotification = (notification: NotificationModel) => {
        notification.setDisplayed(false);
        setTimeout(() => {
            store.notification.removeNotifications(
                [notification],
                store.auth.userLogin,
            );
        }, 300);
    };

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        setScrolled(!isScrolled && event.currentTarget.scrollTop > 0);
    };

    const handleRunApplication = (appId: string, url: string) => {
        const { shell, applicationManager, windowManager } = store;
        const app = store.applicationManager.findById(appId);

        if (app instanceof ExternalApplication) {
            // TODO: Execute application with hash in function
            // #region
            const hashParams = new URLSearchParams();
            hashParams.append("hash", v4());

            const urlWithHash = url + "?" + hashParams.toString();
            // #endregion
            shell.setActivePanel(ShellPanelType.None);

            applicationManager.executeApplicationWithUrl(app, urlWithHash);

            const appWindow = windowManager.findWindowByApp(app);

            if (appWindow) {
                windowManager.focusWindow(appWindow);
            }
        }
    };

    const apps = new Map<string, Application | undefined>();
    const uniqueIds = uniq(
        store.notification.notifications.map((item) => item.applicationId),
    );
    uniqueIds.forEach((item) =>
        apps.set(item, store.applicationManager.findById(item)),
    );

    return (
        <div
            className={classNames(style.notificationHub, {
                [style.show]: store.shell.notificationHubShow,
                "no-animate": !performanceMode.mode.enableAnimation,
            })}
            onAnimationStart={() => setShowBackdrop(false)}
            onAnimationEnd={() => setShowBackdrop(true)}
        >
            <BackdropWrapper active={isShowBackdrop}>
                <div className={style.container}>
                    <div className={style.content}>
                        <div
                            className={classNames(style.title, {
                                [style.titleAfterScroll]: isScrolled,
                            })}
                        >
                            {strings.notification.title}
                        </div>
                        <div
                            className={style.notificationsList}
                            onScroll={handleScroll}
                        >
                            {uniqueIds.length ? (
                                uniqueIds.map((appId) => (
                                    <NotificationGroup
                                        key={appId}
                                        onClear={() => handleClearGroup(appId)}
                                        icon={apps.get(appId)?.icon ?? ""}
                                        title={apps.get(appId)?.name ?? ""}
                                    >
                                        {store.notification.notifications
                                            .filter(
                                                (item) =>
                                                    item.applicationId ===
                                                    appId,
                                            )
                                            .slice(0, 5)
                                            .map((notification) => (
                                                <NotificationCard
                                                    key={notification.id}
                                                    {...notification}
                                                    onClick={() =>
                                                        handleRunApplication(
                                                            notification.applicationId,
                                                            notification.url,
                                                        )
                                                    }
                                                    onClose={() =>
                                                        handleCloseNotification(
                                                            notification,
                                                        )
                                                    }
                                                />
                                            ))}
                                    </NotificationGroup>
                                ))
                            ) : (
                                <PlaceholderWithIcon
                                    icon={
                                        <SVGIcon source={empty} color="white" />
                                    }
                                    content={
                                        strings.notification.noMoreNotifications
                                    }
                                />
                            )}
                        </div>
                    </div>
                </div>
            </BackdropWrapper>
        </div>
    );
});
