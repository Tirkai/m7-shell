import { IconButton, TextField } from "@material-ui/core";
import { ArrowForward } from "@material-ui/icons";
import React, { SyntheticEvent, useEffect, useState } from "react";
import style from "./style.module.css";

interface IDevModeExecutorProps {
    onExecute: (url: string) => void;
}

const LOCALSTORAGE_KEY = "DEV_MODE_LAST_EXECUTED_URL";

export const DevModeExecutor = (props: IDevModeExecutorProps) => {
    const [value, setValue] = useState("http://localhost:3000");

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        props.onExecute(value);
        localStorage.setItem(LOCALSTORAGE_KEY, value);
    };

    useEffect(() => {
        const value = localStorage.getItem(LOCALSTORAGE_KEY);

        if (value) {
            setValue(value);
        }
    }, []);

    return (
        <div className={style.devModeExecutor}>
            <div className={style.container}>
                <div className={style.input}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            fullWidth
                            autoFocus
                            InputProps={{
                                endAdornment: (
                                    <IconButton color="secondary" type="submit">
                                        <ArrowForward />
                                    </IconButton>
                                ),
                                classes: {
                                    root: style.inputRoot,
                                },
                            }}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};
