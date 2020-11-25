import classNames from "classnames";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import style from "./style.module.css";
const className = style.backdropWrapper;

interface IBackdropWrapperProps extends IStore {
    active?: boolean;
}

@inject("store")
@observer
export class BackdropWrapper extends Component<IBackdropWrapperProps> {
    @computed
    get store() {
        return this.props.store!;
    }

    render() {
        return (
            <div
                className={classNames(className, {
                    [style.active]: this.props.active,
                })}
            >
                {this.props.children}
            </div>
        );
    }
}
