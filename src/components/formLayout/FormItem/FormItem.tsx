import React, { Component } from "react";
import style from "./style.module.css";

interface IFormItemProps {
    tooltip?: string;
    tooltipType?: "info" | "error";
}

export class FormItem extends Component<IFormItemProps> {
    render() {
        return (
            <div className={style.formItem}>
                <div className={style.container}>{this.props.children}</div>
                {this.props.tooltip?.length ? (
                    <div className={style.tooltip}>{this.props.tooltip}</div>
                ) : (
                    ""
                )}
            </div>
        );
    }
}
