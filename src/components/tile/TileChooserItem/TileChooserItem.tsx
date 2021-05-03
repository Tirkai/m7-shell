import classNames from "classnames";
import { LayerBoxVisualizer } from "components/debug/LayerBoxVisualizer/LayerBoxVisualizer";
import { TileTemplate } from "models/tile/TileTemplate";
import React from "react";
import style from "./style.module.css";

interface ITileChooserItemProps {
    name?: string;
    template?: TileTemplate;
    active: boolean;
    onClick: () => void;
}

const className = style.tileChooserItem;

export const TileChooserItem = (props: ITileChooserItemProps) => (
    <div
        className={classNames(className, { [style.active]: props.active })}
        onClick={props.onClick}
    >
        {props.name}

        {props.template && (
            <div
                className={style.container}
                style={{
                    gridTemplateColumns: `repeat(${props.template.columns},1fr)`,
                    gridTemplateRows: `repeat(${props.template.rows},1fr)`,
                }}
            >
                {props.template.cells.map((item) => (
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
