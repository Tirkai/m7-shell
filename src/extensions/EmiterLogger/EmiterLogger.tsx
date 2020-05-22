import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import { observer } from "mobx-react";
import React, { Component } from "react";
import { EmiterLoggerStore } from "./EmiterLoggerStore";
import style from "./style.module.css";
const emiterLoggerStore: EmiterLoggerStore = new EmiterLoggerStore();

@observer
export class EmiterLogger extends Component {
    componentDidMount() {
        emiterLoggerStore.init();
    }

    render() {
        return (
            <div className={style.logger}>
                <Table size="small">
                    <TableBody>
                        {emiterLoggerStore.events.length ? (
                            emiterLoggerStore.events.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.source}</TableCell>
                                    <TableCell>{item.type}</TableCell>
                                    <TableCell>
                                        {JSON.stringify(item.payload)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell>Нет записей</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        );
    }
}
