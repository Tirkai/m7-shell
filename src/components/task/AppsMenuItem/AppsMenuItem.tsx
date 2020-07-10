import classNames from "classnames";
import { StartMenuApplicationIcon } from "components/startMenu/StartMenuApplicationIcon/StartMenuApplicationIcon";
import React, { Component } from "react";
import style from "./style.module.css";
interface IAppsMenuItemProps {
    icon: string;
    title: string;
    isExecuted: boolean;
    onClick: () => void;
}

export class AppsMenuItem extends Component<IAppsMenuItemProps> {
    render() {
        return (
            <div
                className={classNames(style.appsMenuItem, {
                    [style.executed]: this.props.isExecuted,
                })}
                onClick={this.props.onClick}
            >
                <StartMenuApplicationIcon>
                    <img src={this.props.icon} alt="App Icon" />
                </StartMenuApplicationIcon>

                <div className={style.title}>
                    {this.props.isExecuted ? (
                        <div className={style.executeStatus} />
                    ) : (
                        ""
                    )}
                    <span>{this.props.title}</span>
                </div>
            </div>
        );
    }
}
