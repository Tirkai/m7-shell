import React, { Component } from "react";
import style from "./style.module.css";

interface IDropdownMenuItemProps {
    onClick: () => void;
}

export class DropdownMenuItem extends Component<IDropdownMenuItemProps> {
    render() {
        return (
            <div
                className={style.dropdownMenuItem}
                onClick={this.props.onClick}
            >
                {this.props.children}
            </div>
        );
    }
}
