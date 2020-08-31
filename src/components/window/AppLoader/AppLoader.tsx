import { SVGIcon } from "@algont/m7-ui";
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
                        <SVGIcon
                            source={this.props.icon}
                            size={{ width: "64px", height: "64px" }}
                            color="#00519c"
                        />
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
