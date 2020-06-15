import { ClickAwayListener } from "@material-ui/core";
import classNames from "classnames";
import { BlurBackground } from "components/layout/BlurBackground/BlurBackground";
import { IStore } from "interfaces/common/IStore";
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

    render() {
        return this.getWithAwayListenerWrapper(
            <div
                className={classNames(style.appsMenu, {
                    [style.visible]: this.props.isShow,
                })}
            >
                <BlurBackground>
                    <div className={style.container}>
                        <div className={style.sidebar}>
                            <div className={style.sidebarTop}>
                                <AppsShellLogo />
                            </div>
                            <div className={style.sidebarBottom}>
                                <AppsProfilePreview />
                            </div>
                        </div>
                        <div className={style.content}>
                            <div className={style.search}>
                                <AppsMenuSearch
                                    value={""}
                                    onChange={() => true}
                                />
                            </div>
                            <div className={style.appsList}>
                                {this.props.applications.map((app) => (
                                    <AppsMenuItem
                                        key={app.id}
                                        icon={app.icon}
                                        title={app.name}
                                        onClick={() =>
                                            this.props.onExecuteApp(app)
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </BlurBackground>
            </div>,
        );
    }
}
