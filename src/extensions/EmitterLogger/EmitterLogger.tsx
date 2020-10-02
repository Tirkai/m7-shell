import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import { observer } from "mobx-react";
import React, { Component } from "react";
import { EmitterLoggerStore } from "./EmitterLoggerStore";
import style from "./style.module.css";
const emitterLoggerStore: EmitterLoggerStore = new EmitterLoggerStore();

@observer
export class EmitterLogger extends Component {
    componentDidMount() {
        emitterLoggerStore.init();
    }

    render() {
        return (
            <div className={style.logger}>
                <Table size="small">
                    <TableBody>
                        {emitterLoggerStore.events.length ? (
                            emitterLoggerStore.events.map((item, index) => (
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
