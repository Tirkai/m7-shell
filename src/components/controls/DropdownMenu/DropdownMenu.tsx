import { ClickAwayListener } from "@material-ui/core";
import classNames from "classnames";
import { BackdropWrapper } from "components/layout/BackdropWrapper/BackdropWrapper";
import React, { Component } from "react";
import style from "./style.module.css";

type DropdownPosition =
    | "topCenter"
    | "topRight"
    | "bottomRight"
    | "bottomCenter"
    | "bottomLeft"
    | "topLeft"
    | "topEdge";

interface IDropdownMenuProps {
    render: JSX.Element[];
    position?: DropdownPosition;
    trigger?: "click" | "context";
}

export class DropdownMenu extends Component<IDropdownMenuProps> {
    static defaultProps = {
        position: "topLeft",
        trigger: "click",
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
                        onClick={
                            this.props.trigger === "click"
                                ? () => this.handleShowDropdown(true)
                                : undefined
                        }
                        onContextMenu={
                            this.props.trigger === "context"
                                ? () => this.handleShowDropdown(true)
                                : undefined
                        }
                    >
                        {this.props.children}
                    </div>
                    <div
                        className={classNames(
                            style.dropdownMenu,
                            {
                                [style.show]:
                                    this.state.show && this.props.render.length,
                            },
                            style[this.props.position ?? "topLeft"],
                        )}
                        onClick={() => this.handleShowDropdown(false)}
                    >
                        <BackdropWrapper>
                            <div className={style.container}>
                                {this.props.render}
                            </div>
                        </BackdropWrapper>
                    </div>
                </div>
            </ClickAwayListener>
        );
    }
}
