import classNames from "classnames";
import { useStore } from "hooks/useStore";
import { TileTemplate } from "models/tile/TileTemplate";
import React from "react";
import { TileChooserGrid } from "../TileChooserGrid/TileChooserGrid";
import { TileChooserItem } from "../TileChooserItem/TileChooserItem";
import style from "./style.module.css";

const className = style.tilePresetChooser;

interface ITilePresetChooserProps {
    show: boolean;
    onApply: (template: TileTemplate) => void;
    templates: TileTemplate[];
}

export const TilePresetChooser = (props: ITilePresetChooserProps) => {
    const store = useStore();

    const handleApplyPreset = (template: TileTemplate) => {
        props.onApply(template);
    };

    return (
        <div className={classNames(className, { [style.show]: props.show })}>
            <TileChooserGrid>
                {props.templates.map((template) => (
                    <TileChooserItem
                        key={template.id}
                        onClick={() => handleApplyPreset(template)}
                        template={template}
                        active={false}
                    />
                ))}
            </TileChooserGrid>
        </div>
    );
};
