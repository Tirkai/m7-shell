import React, { Component } from "react";
import style from "./style.module.css";

export class FormKeyValueRow extends Component {
    render() {
        return (
            <div className={style.formKeyValueRow}>{this.props.children}</div>
        );
    }
}
