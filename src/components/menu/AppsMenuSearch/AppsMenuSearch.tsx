import { IconButton } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import classNames from "classnames";
import { strings } from "locale";
import React, { Component } from "react";
import style from "./style.module.css";

interface IAppsMenuSearch {
    value: string;
    onChange: (value: string) => void;
    onRefInput: (ref: HTMLInputElement | null) => void;
}

export class AppsMenuSearch extends Component<IAppsMenuSearch> {
    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChange(event.target.value);
    };

    render() {
        return (
            <div className={style.appsMenuSearch}>
                <input
                    className={style.input}
                    onChange={this.handleChange}
                    value={this.props.value}
                    placeholder={strings.startMenu.search}
                    maxLength={100}
                    ref={(ref) => this.props.onRefInput(ref)}
                />
                <div
                    className={classNames(style.actions, {
                        [style.isVisible]: this.props.value.length > 0,
                    })}
                >
                    <IconButton size="small">
                        <Clear
                            className={style.icon}
                            onClick={() => this.props.onChange("")}
                        />
                    </IconButton>
                </div>
            </div>
        );
    }
}
