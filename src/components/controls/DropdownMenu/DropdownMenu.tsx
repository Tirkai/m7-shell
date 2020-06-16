import { ClickAwayListener } from "@material-ui/core";
import classNames from "classnames";
import React, { Component } from "react";
import style from "./style.module.css";

type DropdownPosition = "topRight" | "bottomRight" | "bottomLeft" | "topLeft";

interface IDropdownMenuProps {
    render: JSX.Element | JSX.Element[];
    position?: DropdownPosition;
}

export class DropdownMenu extends Component<IDropdownMenuProps> {
    static defaultProps = {
        position: "topLeft",
    };

    state = {
        show: false,
    };

    handleShowDropdown = (value: boolean) => {
        this.setState({ show: value });
    };

    render() {
        return (
            <ClickAwayListener
                onClickAway={() => this.handleShowDropdown(false)}
            >
                <div className={style.dropdownContainer}>
                    <div
                        className={style.dropdownListener}
                        onClick={() => this.handleShowDropdown(true)}
                    >
                        {this.props.children}
                    </div>
                    <div
                        className={classNames(
                            style.dropdownMenu,
                            {
                                [style.show]: this.state.show,
                            },
                            style[this.props.position ?? "topLeft"],
                        )}
                        onClick={() => this.handleShowDropdown(false)}
                    >
                        {this.props.render}
                    </div>
                </div>
            </ClickAwayListener>
        );
    }
}
