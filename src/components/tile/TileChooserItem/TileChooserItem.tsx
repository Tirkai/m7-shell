import classNames from "classnames";
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
                    gridTemplateAreas: props.template.areas,
                    gridTemplateColumns: `repeat(${props.template.columns},1fr)`,
                    gridTemplateRows: `repeat(${props.template.rows},1fr)`,
                }}
            >
                {props.template.cells.map((item) => (
                    <div
                        className={style.gridItem}
                        style={{
                            gridArea: item.area,
                        }}
                        key={item.id}
                    ></div>
                ))}
            </div>
        )}
    </div>
);
