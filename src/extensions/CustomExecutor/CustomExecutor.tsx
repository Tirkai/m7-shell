import { Button, TextField } from "@material-ui/core";
import { useStore } from "hooks/useStore";
import { strings } from "locale";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { ExternalApplication } from "models/ExternalApplication";
import React, { useState } from "react";
import { v4 } from "uuid";
import style from "./style.module.css";

export const CustomExecutor = () => {
    const store = useStore();
    const [value, setValue] = useState("http://");

    const handleExecuteProcess = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const id = v4();

        const app = new ExternalApplication({
            id,
            name: value,
            url: value,
            key: `${id}`,
        });

        store.applicationManager.addApplication(app);

        new ApplicationRunner(store).run(app);
    };

    return (
        <div className={style.customExecutor}>
            <form onSubmit={handleExecuteProcess}>
                <div className={style.container}>
                    <TextField
                        value={value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setValue(e.target.value)
                        }
                    ></TextField>
                    <Button type="submit" color="primary" variant="contained">
                        {strings.shellApps.customExecutor.execute}
                    </Button>
                </div>
            </form>
        </div>
    );
};
