import { flatten } from "lodash";
import { DesktopCellModel } from "models/DesktopCellModel";
import React, { useEffect, useState } from "react";
import { DesktopGridCell } from "../DesktopGridCell/DesktopGridCell";
import style from "./style.module.css";

interface IDesktopGridConfigProps {
    children?: React.ReactNode;
}

const className = style.desktopGridConfig;

export const DesktopGridConfig = (props: IDesktopGridConfigProps) => {
    const [cells, setCells] = useState<DesktopCellModel[]>([]);
    const [startCell, setStartCell] = useState<DesktopCellModel | null>(null);
    const [endCell, setEndCell] = useState<DesktopCellModel | null>(null);

    useEffect(() => {
        const c = [];
        for (let i = 0; i < 12; i++) {
            const d = [];
            for (let j = 0; j < 12; j++) {
                d.push(new DesktopCellModel(j + 1, i + 1));
            }
            c.push(d);
        }

        const f = flatten(c);

        setCells(f);
    }, []);

    const handleCellClick = (cell: DesktopCellModel) => {
        if (startCell?.id === cell.id || endCell?.id === cell.id) {
            setStartCell(null);
        }
        if (!startCell) {
            setStartCell(cell);
            cells.forEach((item) => item.setActive(false));
        } else {
            setEndCell(cell);
        }
    };

    const compare = (start: number, end: number, value: number) => {
        if (start <= end) {
            return value >= start && value <= end;
        } else {
            return value <= start && value >= end;
        }
    };

    useEffect(() => {
        const startColumns = startCell?.column ?? 0;
        const endColumns = endCell?.column ?? 0;
        const startRow = startCell?.row ?? 0;
        const endRow = endCell?.row ?? 0;
        const z = cells.filter(
            (item) =>
                compare(startColumns, endColumns, item.column) &&
                compare(startRow, endRow, item.row),
        );
        z.forEach((item) => item.setActive(true));
        setStartCell(null);
    }, [endCell]);

    return (
        <div className={className}>
            {cells.map((item) => (
                <DesktopGridCell
                    key={item.id}
                    isActive={item.isActive || item.id === startCell?.id}
                    onClick={() => handleCellClick(item)}
                />
            ))}
        </div>
    );
};
