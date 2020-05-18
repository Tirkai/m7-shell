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

    getWithAwayListenerWrapper = (Component: JSX.Element) => {
        if (this.store.shell.appMenuShow) {
            return (
                <ClickAwayListener onClickAway={this.handleClickAway}>
                    {Component}
                </ClickAwayListener>
            );
        }
        return Component;
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
                        <div className={style.content}>
                            <div className={style.search}>
                                <AppsMenuSearch
                                    value={""}
                                    onChange={() => {}}
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
                        <div className={style.sidebar}>
                            <AppsProfilePreview />
                        </div>
                    </div>
                </BlurBackground>
            </div>,
        );
    }
}
