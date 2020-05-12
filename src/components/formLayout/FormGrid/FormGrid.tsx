import React, { Component } from "react";
import style from "./style.module.css";

interface IFormGridProps {
    columns: number;
}

export class FormGrid extends Component<IFormGridProps> {
    render() {
        return (
            <div
                className={style.formGrid}
                style={{
                    gridTemplateColumns: `repeat(${this.props.columns}, 1fr)`,
                }}
            >
                {this.props.children}
            </div>
        );
    }
}

export default FormGrid;
