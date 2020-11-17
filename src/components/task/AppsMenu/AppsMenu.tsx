import classNames from "classnames";
import { DropdownMenu } from "components/controls/DropdownMenu/DropdownMenu";
import { DropdownMenuItem } from "components/controls/DropdownMenuItem/DropdownMenuItem";
import { BackdropWrapper } from "components/layout/BackdropWrapper/BackdropWrapper";
import { ApplicationPlace } from "enum/ApplicationPlace";
import { IStore } from "interfaces/common/IStore";
import { strings } from "locale";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { Application } from "models/Application";
import React, { Component } from "react";
import { AppsMenuItem } from "../AppsMenuItem/AppsMenuItem";
import AppsMenuSearch from "../AppsMenuSearch/AppsMenuSearch";
import AppsProfilePreview from "../AppsProfilePreview/AppsProfilePreview";
import { AppsSettings } from "../AppsSettings/AppsSettings";
import { AppsShellLogo } from "../AppsShellLogo/AppsShellLogo";
import style from "./style.module.css";

@inject("store")
@observer
export class AppsMenu extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    state = {
        isShowBackdrop: false,
    };

    handleSearch = (value: string) => {
        this.store.applicationManager.setSearch(value);
    };

    handleExecuteLicenseApp = () => {
        const app = this.store.applicationManager.findByKey("License");
        if (app) {
            this.store.applicationManager.executeApplication(app);
        }
    };

    handleEnableDevMode = (value: boolean) => {
        this.store.shell.setDevMode(value);
    };

    handleExecuteApp = (app: Application) => {
        if (app.isAvailable) {
            if (!app.isExecuted) {
                this.store.applicationManager.executeApplication(app);
            } else {
                const appWindow = this.store.windowManager.findWindowByApp(app);
                if (appWindow) {
                    this.store.windowManager.focusWindow(appWindow);
                }
            }
        }
    };

    getFilteredByPlace = (
        apps: Application[],
        place: ApplicationPlace,
        showDefault: boolean = false,
    ) =>
        apps.filter(
            (item) =>
                item.place === place ||
                (showDefault ? item.place === ApplicationPlace.Unknown : false),
        );

    handleAnimationStart = () => {
        this.setState({
            isShowBackdrop: false,
        });
    };

    handleAnimationEnd = () => {
        this.setState({
            isShowBackdrop: true,
        });
    };

    render() {
        const applicationsList = !this.store.shell.enabledDevMode
            ? this.store.applicationManager.displayedApplications
            : this.store.applicationManager.applications;

        const userMenuApps = this.getFilteredByPlace(
            this.store.applicationManager.applications,
            ApplicationPlace.UserMenu,
        );

        const settingsMenuApps = this.getFilteredByPlace(
            this.store.applicationManager.applications,
            ApplicationPlace.Settings,
        );

        const shellMenuApps = this.getFilteredByPlace(
            this.store.applicationManager.applications,
            ApplicationPlace.M7Menu,
        );
        // TODO: Refactor
        return (
            <div
                className={classNames(style.appsMenu, {
                    [style.show]: this.store.shell.appMenuShow,
                })}
                onAnimationStart={this.handleAnimationStart}
                onAnimationEnd={this.handleAnimationEnd}
            >
                <BackdropWrapper active={this.state.isShowBackdrop}>
                    <div className={style.container}>
                        <div className={style.sidebar}>
                            <div className={style.sidebarTop}>
                                <div className={style.logo}>
                                    {this.store.auth.isAdmin ||
                                    this.store.auth.isSysadmin ? (
                                        <DropdownMenu
                                            render={[
                                                ...shellMenuApps.map((app) => (
                                                    <DropdownMenuItem
                                                        key={app.id}
                                                        onClick={async () =>
                                                            this.store.applicationManager.executeApplication(
                                                                app,
                                                            )
                                                        }
                                                    >
                                                        {app.name}
                                                    </DropdownMenuItem>
                                                )),
                                                ...[
                                                    this.store.auth.isAdmin ? (
                                                        <DropdownMenuItem
                                                            key={"devmode"}
                                                            onClick={() =>
                                                                this.handleEnableDevMode(
                                                                    !this.store
                                                                        .shell
                                                                        .enabledDevMode,
                                                                )
                                                            }
                                                        >
                                                            {
                                                                strings
                                                                    .startMenu
                                                                    .devMode
                                                            }
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <></>
                                                    ),
                                                ],
                                            ]}
                                        >
                                            <AppsShellLogo />
                                        </DropdownMenu>
                                    ) : (
                                        <AppsShellLogo />
                                    )}
                                </div>
                            </div>
                            <div className={style.sidebarBottom}>
                                <AppsSettings apps={settingsMenuApps} />
                                <AppsProfilePreview apps={userMenuApps} />
                            </div>
                        </div>
                        <div className={style.content}>
                            <div className={style.search}>
                                <AppsMenuSearch
                                    value={this.store.applicationManager.search}
                                    onChange={this.handleSearch}
                                />
                            </div>
                            <div className={style.appsListWrapper}>
                                <div className={style.appsList}>
                                    {this.store.applicationManager.isSearching
                                        ? this.getFilteredByPlace(
                                              this.store.applicationManager
                                                  .findedApplicatons,
                                              ApplicationPlace.MainMenu,
                                              true,
                                          ).map((app) => (
                                              <AppsMenuItem
                                                  key={app.id}
                                                  icon={app.icon}
                                                  title={app.name}
                                                  isExecuted={app.isExecuted}
                                                  isAvailable={app.isAvailable}
                                                  onClick={() =>
                                                      this.handleExecuteApp(app)
                                                  }
                                              />
                                          ))
                                        : this.getFilteredByPlace(
                                              applicationsList,
                                              ApplicationPlace.MainMenu,
                                              true,
                                          ).map((app) => (
                                              <AppsMenuItem
                                                  key={app.id}
                                                  icon={app.icon}
                                                  title={app.name}
                                                  isExecuted={app.isExecuted}
                                                  isAvailable={app.isAvailable}
                                                  onClick={() =>
                                                      this.handleExecuteApp(app)
                                                  }
                                              />
                                          ))}
                                    {this.store.applicationManager
                                        .isSearching &&
                                    this.store.applicationManager
                                        .findedApplicatons.length <= 0 ? (
                                        <div className={style.notFoundApps}>
                                            {strings.state.notFound}
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </BackdropWrapper>
            </div>
        );
    }
}
