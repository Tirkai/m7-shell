import React, { Component } from "react";
import style from "./style.module.css";

interface IAppsMenuSearch {
    value: string;
    onChange: (value: string) => void;
}

export class AppsMenuSearch extends Component<IAppsMenuSearch> {
    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChange(event.target.value);
    };

    render() {
        return (
            <input
                className={style.input}
                onChange={this.handleChange}
                placeholder="Поиск"
            />
        );
    }
}

export default AppsMenuSearch;
