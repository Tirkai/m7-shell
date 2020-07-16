import { ClickAwayListener } from "@material-ui/core";
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

interface IAppsMenuProps extends IStore {
    isShow: boolean;
    applications: Application[];
    onExecuteApp: (app: Application) => void;
}
@inject("store")
@observer
export class AppsMenu extends Component<IAppsMenuProps> {
    @computed
    get store() {
        return this.props.store!;
    }
    handleClickAway = () => {
        this.store.shell.setAppMenuShow(false);
    };

    getWithAwayListenerWrapper = (AppMenuComponent: JSX.Element) => {
        if (this.store.shell.appMenuShow) {
            return (
                <ClickAwayListener onClickAway={this.handleClickAway}>
                    {AppMenuComponent}
                </ClickAwayListener>
            );
        }
        return AppMenuComponent;
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

    render() {
        const applicationsList = !this.store.shell.enabledDevMode
            ? this.store.applicationManager.displayedApplications
            : this.store.applicationManager.applications;

        return this.getWithAwayListenerWrapper(
            <div
                className={classNames(style.appsMenu, {
                    [style.visible]: this.props.isShow,
                })}
            >
                <div className={style.container}>
                    <div className={style.sidebar}>
                        <div className={style.sidebarTop}>
                            <div className={style.logo}>
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
                                        <DropdownMenuItem
                                            key={"devmode"}
                                            onClick={() =>
                                                this.handleEnableDevMode(
                                                    !this.store.shell
                                                        .enabledDevMode,
                                                )
                                            }
                                        >
                                            {this.store.shell.enabledDevMode
                                                ? strings.startMenu.devModeOn
                                                : strings.startMenu.devModeOff}
                                        </DropdownMenuItem>,
                                    ]}
                                >
                                    <AppsShellLogo />
                                </DropdownMenu>
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
                        <div className={style.appsList}>
                            {this.store.applicationManager.isSearching
                                ? this.store.applicationManager.findedApplicatons.map(
                                      (app) => (
                                          <AppsMenuItem
                                              key={app.id}
                                              icon={app.icon}
                                              title={app.name}
                                              onClick={() =>
                                                  this.props.onExecuteApp(app)
                                              }
                                          />
                                      ),
                                  )
                                : applicationsList.map((app) => (
                                      <AppsMenuItem
                                          key={app.id}
                                          icon={app.icon}
                                          title={app.name}
                                          onClick={() =>
                                              this.props.onExecuteApp(app)
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
            </div>,
        );
    }
}
