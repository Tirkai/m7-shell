import { CircularProgress } from "@material-ui/core";
import classNames from "classnames";
import React, { Component } from "react";
import style from "./style.module.css";
interface IAppLoaderProps {
    disabled: boolean;
    icon: string;
}

export class AppLoader extends Component<IAppLoaderProps> {
    render() {
        return (
            <div
                className={classNames(style.appLoader, {
                    [style.disabled]: this.props.disabled,
                })}
            >
                <div className={style.container}>
                    <div className={style.icon}>
                        <img src={this.props.icon} />
                    </div>
                    <div className={style.loader}>
                        <CircularProgress />
                    </div>
                </div>
            </div>
        );
    }
}

export default AppLoader;
