import { ContentWithHeaderLayout } from "@algont/m7-ui";
import { Tab, Table, TableCell, TableRow, Tabs } from "@material-ui/core";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import React, { Component } from "react";
import { DevModeStore } from "./DevModeStore";
import style from "./style.module.css";

const store = new DevModeStore();

@inject("store")
@observer
export class DevModeView extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    version = process.env.REACT_APP_VERSION;
    author = process.env.REACT_APP_AUTHOR;
    commit = process.env.REACT_APP_COMMIT;
    date = process.env.REACT_APP_DATE;
    email = process.env.REACT_APP_EMAIL;
    branch = process.env.REACT_APP_BRANCH;

    render() {
        return (
            <ContentWithHeaderLayout
                layoutUnitType="page"
                header={
                    <Tabs
                        color="primary"
                        classes={{
                            root: style.tabs,
                        }}
                    >
                        <Tab label="Инфо" />
                        <Tab label="Запуск" />
                    </Tabs>
                }
                content={
                    <Table>
                        <TableRow>
                            <TableCell>Версия</TableCell>
                            <TableCell>{this.version}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Ветка</TableCell>
                            <TableCell>{this.branch}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Время до обновления токена</TableCell>
                        </TableRow>
                    </Table>
                }
            />
        );
    }
}
