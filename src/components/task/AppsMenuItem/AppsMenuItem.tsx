import { SVGIcon } from "@algont/m7-ui";
import classNames from "classnames";
import { StartMenuApplicationIcon } from "components/startMenu/StartMenuApplicationIcon/StartMenuApplicationIcon";
import React, { Component } from "react";
import style from "./style.module.css";
interface IAppsMenuItemProps {
    icon: string;
    title: string;
    isExecuted: boolean;
    isAvailable: boolean;
    onClick: () => void;
}

export class AppsMenuItem extends Component<IAppsMenuItemProps> {
    render() {
        return (
            <div
                className={classNames(style.appsMenuItem, {
                    [style.executed]: this.props.isExecuted,
                    [style.unavailable]: !this.props.isAvailable,
                })}
                onClick={this.props.onClick}
            >
                <StartMenuApplicationIcon>
                    <SVGIcon
                        source={this.props.icon}
                        size={{ width: "32px", height: "32px" }}
                        color="white"
                    />
                </StartMenuApplicationIcon>
                {this.props.isExecuted ? (
                    <div className={style.executeStatus} />
                ) : (
                    ""
                )}
                <div className={style.title}>
                    <span>{this.props.title}</span>
                </div>
            </div>
        );
    }
}
