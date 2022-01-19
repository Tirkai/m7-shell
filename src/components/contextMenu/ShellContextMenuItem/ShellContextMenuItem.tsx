import classNames from "classnames";
import React, { Component } from "react";
import style from "./style.module.css";

const className = style.shellContextMenuItem;

interface IShellContextMenuItemProps {
    icon?: React.ReactNode;
    content: string | JSX.Element;
    onClick: (_opts?: any) => any;
}

export class ShellContextMenuItem extends Component<IShellContextMenuItemProps> {
    render() {
        return (
            <div className={classNames(className)} onClick={this.props.onClick}>
                <div className={style.icon}>
                    {this.props.icon ? this.props.icon : ""}
                </div>
                <div className={style.content}>{this.props.content}</div>
            </div>
        );
    }
}
