import classNames from "classnames";
import React, { Component } from "react";
import style from "./style.module.css";

const className = style.appsMenuSidebarListItem;

interface IAppsMenuSidebarListItemProps {
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export class AppsMenuSidebarListItem extends Component<
    IAppsMenuSidebarListItemProps
> {
    render() {
        return (
            <div onClick={this.props.onClick} className={classNames(className)}>
                {this.props.children}
            </div>
        );
    }
}
