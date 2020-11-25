import { SVGIcon } from "@algont/m7-ui";
import classNames from "classnames";
import React, { Component } from "react";
import style from "./style.module.css";

const className = style.shellContextMenuItem;

interface IShellContextMenuItemProps {
    icon?: string;
    content: string | JSX.Element;
    onClick: () => void;
}

export class ShellContextMenuItem extends Component<
    IShellContextMenuItemProps
> {
    render() {
        return (
            <div className={classNames(className)} onClick={this.props.onClick}>
                <div className={style.icon}>
                    {this.props.icon ? (
                        <SVGIcon source={this.props.icon} color="white" />
                    ) : (
                        ""
                    )}
                </div>
                <div className={style.content}>{this.props.content}</div>
            </div>
        );
    }
}
