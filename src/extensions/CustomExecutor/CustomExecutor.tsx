import { Button, TextField } from "@material-ui/core";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { ExternalApllication } from "models/ExternalApplication";
import React, { Component } from "react";
import { v4 } from "uuid";
import style from "./style.module.css";

@inject("store")
@observer
export class CustomExecutor extends Component<IStore> {
    @computed
    get store() {
        return this.props.store;
    }

    state = {
        link: "",
    };

    handleCreateAppInstance = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(this.state.link);

        const id = v4();

        const app = new ExternalApllication({
            id,
            name: `App ${this.state.link}`,
            url: this.state.link,
            baseHeight: 600,
            baseWidth: 800,
            key: `${id}`,
        });

        this.store?.applicationManager.addApplication(app);

        this.store?.applicationManager.executeApplication(app);
    };

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        this.setState({
            link: value,
        });
    };

    render() {
        return (
            <div className={style.customExecutor}>
                <form onSubmit={this.handleCreateAppInstance}>
                    <div className={style.container}>
                        <TextField
                            value={this.state.link}
                            onChange={this.handleChange}
                        ></TextField>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                        >
                            Run
                        </Button>
                    </div>
                </form>
            </div>
        );
    }
}
