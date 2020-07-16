import classNames from "classnames";
import { IStore } from "interfaces/common/IStore";
import { strings } from "locale";
import { uniq } from "lodash";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { Application } from "models/Application";
import { ExternalApllication } from "models/ExternalApplication";
import { NotificationModel } from "models/NotificationModel";
import React, { Component } from "react";
import { NotificationCard } from "../NotificationCard/NotificationCard";
import { NotificationGroup } from "../NotificationGroup/NotificationGroup";
import style from "./style.module.css";

@inject("store")
@observer
export class NotificationHub extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    state = {
        isScrolled: false,
    };

    handleClearGroup = (id: string) => {
        this.store.notification.removeNotifications(
            this.store.notification.notifications.filter(
                (item) => item.applicationId === id,
            ),
            this.store.auth.userLogin,
        );
    };

    handleCloseNotification = (notification: NotificationModel) => {
        this.store.notification.removeNotifications(
            [notification],
            this.store.auth.userLogin,
        );
    };

    handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        if (this.state.isScrolled && event.currentTarget.scrollTop <= 0) {
            this.setState({ isScrolled: false });
        }
        if (!this.state.isScrolled && event.currentTarget.scrollTop > 0) {
            this.setState({ isScrolled: true });
        }
    };

    handleRunApplication = (appId: string, url: string) => {
        const app = this.store.applicationManager.findById(appId);
        if (app instanceof ExternalApllication) {
            this.store.applicationManager.executeApplicationWithUrl(app, url);
        }
    };

    render() {
        const apps = new Map<string, Application | undefined>();
        const uniqueIds = uniq(
            this.store.notification.notifications.map(
                (item) => item.applicationId,
            ),
        );
        uniqueIds.forEach((item) =>
            apps.set(item, this.store.applicationManager.findById(item)),
        );

        return (
            <div
                className={classNames(style.notificationHub, {
                    [style.show]: this.store.shell.notificationHubShow,
                })}
            >
                <div className={style.container}>
                    <div className={style.content}>
                        <div
                            className={classNames(style.title, {
                                [style.titleAfterScroll]: this.state.isScrolled,
                            })}
                        >
                            {strings.notification.title}
                        </div>
                        <div
                            className={style.notificationsList}
                            onScroll={this.handleScroll}
                        >
                            {uniqueIds.length
                                ? uniqueIds.map((appId) => (
                                      <NotificationGroup
                                          key={appId}
                                          onClear={() =>
                                              this.handleClearGroup(appId)
                                          }
                                          icon={apps.get(appId)?.icon ?? ""}
                                          title={apps.get(appId)?.name ?? ""}
                                      >
                                          {this.store.notification.notifications
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
                                                          this.handleRunApplication(
                                                              notification.applicationId,
                                                              notification.url,
                                                          )
                                                      }
                                                      onClose={() =>
                                                          this.handleCloseNotification(
                                                              notification,
                                                          )
                                                      }
                                                  />
                                              ))}
                                      </NotificationGroup>
                                  ))
                                : strings.notification.noMoreNotifications}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
