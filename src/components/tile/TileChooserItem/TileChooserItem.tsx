import { LayerBoxVisualizer } from "components/debug/LayerBoxVisualizer/LayerBoxVisualizer";
import { TilePreset } from "models/tile/TilePreset";
import React from "react";
import style from "./style.module.css";

interface ITileChooserItemProps {
    name?: string;
    preset?: TilePreset;
    onClick: () => void;
}

const className = style.tileChooserItem;

export const TileChooserItem = (props: ITileChooserItemProps) => (
    <div className={className} onClick={props.onClick}>
        {props.name}

        {props.preset && (
            <div
                className={style.container}
                style={{
                    gridTemplateColumns: `repeat(${props.preset.columns},1fr)`,
                    gridTemplateRows: `repeat(${props.preset.rows},1fr)`,
                }}
            >
                {props.preset.cells.map((item) => (
                    <div
                        className={style.gridItem}
                        style={{
                            gridRow: `${item.startRow}/${item.endRow}`,
                            gridColumn: `${item.startColumn}/${item.endColumn}`,
                        }}
                        key={item.id}
                    >
                        <LayerBoxVisualizer />
                    </div>
                ))}
            </div>
        )}
    </div>
);
