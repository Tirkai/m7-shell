import { LayerBoxVisualizer } from "components/debug/LayerBoxVisualizer/LayerBoxVisualizer";
import { TileCell } from "models/tile/TileCell";
import React from "react";
import style from "./style.module.css";

interface ITileDesktopAreaProps {
    cell: TileCell;
    children?: React.ReactNode;
    onEnter?: () => void;
    onExit?: () => void;
    active: boolean;
}

const className = style.tileDesktopArea;

export const TileDesktopArea = (props: ITileDesktopAreaProps) => {
    const handleEnter = () => {
        if (props.active && props.onEnter) {
            props.onEnter();
        }
    };

    const handleExit = () => {
        if (props.active && props.onExit) {
            props.onExit();
        }
    };

    return (
        <div
            className={className}
            onMouseEnter={handleEnter}
            onMouseLeave={handleExit}
            style={{
                gridArea: props.cell.area,
            }}
        >
            <div className={style.container}>
                {!!props.active && <LayerBoxVisualizer />}
            </div>
        </div>
    );
};
