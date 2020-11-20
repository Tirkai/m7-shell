import { SVGIcon } from "@algont/m7-ui";
import React, { Component } from "react";
import style from "./style.module.css";

interface IAppWindowHeaderActionProps {
    icon: string;
    onClick: (e: React.MouseEvent) => void;
}

export class AppWindowHeaderAction extends Component<
    IAppWindowHeaderActionProps
> {
    render() {
        return (
            <div className={style.action} onClick={this.props.onClick}>
                <SVGIcon
                    source={this.props.icon}
                    color="white"
                    size={{
                        width: "12px",
                        height: "12px",
                    }}
                />
            </div>
        );
    }
}
