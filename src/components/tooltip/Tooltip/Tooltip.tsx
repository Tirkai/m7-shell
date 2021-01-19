import classNames from 'classnames';
import React, { Component } from "react";
import style from "./style.module.css";



const className = style.tooltip;

export class Tooltip extends Component {
    
    render() {
        return (
            <div className={classNames(className)}>
            
            </div>
        );
    }
}
