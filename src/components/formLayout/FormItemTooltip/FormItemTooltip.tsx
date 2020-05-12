import classNames from "classnames";
import React, { Component } from "react";
import style from "./style.module.css";

interface IFormItemTooltip {
    open: boolean;
    type?: "info" | "error";
}

export class FormItemTooltip extends Component<IFormItemTooltip> {
    static defaultProps = {
        type: "info",
    };

    render() {
        return (
            <div className={style.tooltipContainer}>
                <div
                    className={classNames(style.tooltip, {
                        [style.open]: this.props.open,
                    })}
                >
                    <div className={style.container}>{this.props.children}</div>
                </div>
            </div>
        );
    }
}
