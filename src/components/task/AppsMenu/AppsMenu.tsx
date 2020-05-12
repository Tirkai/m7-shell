import classNames from "classnames";
import { BlurBackground } from "components/layout/BlurBackground/BlurBackground";
import { inject, observer } from "mobx-react";
import { Application } from "models/Application";
import React, { Component } from "react";
import { AppsMenuItem } from "../AppsMenuItem/AppsMenuItem";
import style from "./style.module.css";

interface IAppsMenuProps {
    isShow: boolean;
    applications: Application[];
    onExecuteApp: (app: Application) => void;
}
@inject("store")
@observer
export class AppsMenu extends Component<IAppsMenuProps> {
    render() {
        return (
            <div
                className={classNames(style.appsMenu, {
                    [style.visible]: this.props.isShow,
                })}
            >
                <BlurBackground>
                    <div className={style.container}>
                        {this.props.applications.map((app) => (
                            <AppsMenuItem
                                key={app.id}
                                icon={app.icon}
                                title={app.name}
                                onClick={() => this.props.onExecuteApp(app)}
                            />
                        ))}
                    </div>
                </BlurBackground>
            </div>
        );
    }
}
