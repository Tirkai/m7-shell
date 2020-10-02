import classNames from "classnames";
import { DropdownMenu } from "components/controls/DropdownMenu/DropdownMenu";
import { DropdownMenuItem } from "components/controls/DropdownMenuItem/DropdownMenuItem";
import { IStore } from "interfaces/common/IStore";
import { strings } from "locale";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { Application } from "models/Application";
import React, { Component } from "react";
import { AppsMenuItem } from "../AppsMenuItem/AppsMenuItem";
import AppsMenuSearch from "../AppsMenuSearch/AppsMenuSearch";
import AppsProfilePreview from "../AppsProfilePreview/AppsProfilePreview";
import { AppsShellLogo } from "../AppsShellLogo/AppsShellLogo";
import style from "./style.module.css";

@inject("store")
@observer
export class AppsMenu extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

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
            this.store.applicationManager.executeApplication(app);
        }
    };

    render() {
        const applicationsList = !this.store.shell.enabledDevMode
            ? this.store.applicationManager.displayedApplications
            : this.store.applicationManager.applications;

        return (
            <div
                className={classNames(style.appsMenu, {
                    [style.visible]: this.store.shell.appMenuShow,
                })}
            >
                <div className={style.container}>
                    <div className={style.sidebar}>
                        <div className={style.sidebarTop}>
                            <div className={style.logo}>
                                {this.store.auth.isAdmin ||
                                this.store.auth.isSysadmin ? (
                                    <DropdownMenu
                                        render={[
                                            <DropdownMenuItem
                                                key={"licence"}
                                                onClick={
                                                    this.handleExecuteLicenseApp
                                                }
                                            >
                                                {
                                                    strings.definedApplications
                                                        .license
                                                }
                                            </DropdownMenuItem>,
                                            this.store.auth.isAdmin ? (
                                                <DropdownMenuItem
                                                    key={"devmode"}
                                                    onClick={() =>
                                                        this.handleEnableDevMode(
                                                            !this.store.shell
                                                                .enabledDevMode,
                                                        )
                                                    }
                                                >
                                                    {strings.startMenu.devMode}
                                                </DropdownMenuItem>
                                            ) : (
                                                <></>
                                            ),
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
                            <AppsProfilePreview />
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
                                    ? this.store.applicationManager.findedApplicatons.map(
                                          (app) => (
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
                                          ),
                                      )
                                    : applicationsList.map((app) => (
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
                                {this.store.applicationManager.isSearching &&
                                this.store.applicationManager.findedApplicatons
                                    .length <= 0 ? (
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
            </div>
        );
    }
}
