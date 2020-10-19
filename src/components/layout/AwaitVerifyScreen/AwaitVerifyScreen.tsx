import { CircularProgress } from "@material-ui/core";
import classNames from "classnames";
import { strings } from "locale";
import React, { Component } from "react";
import style from "./style.module.css";

const className = style.awaitVerifyScreen;

export class AwaitVerifyScreen extends Component {
    render() {
        return (
            <div className={classNames(className)}>
                <div className={style.container}>
                    <div className={style.loader}>
                        <CircularProgress color="secondary" />
                    </div>
                    <div className={style.text}>
                        {strings.state.sessionRecovery}
                    </div>
                </div>
            </div>
        );
    }
}
