import React, { Component } from "react";
import style from "./style.module.css";
export class BlurBackground extends Component {
    render() {
        return (
            <div className={style.container}>
                <div className={style.blurWrapper}>
                    <div className={style.blur}></div>
                </div>
                <div className={style.content}>{this.props.children}</div>
            </div>
        );
    }
}
