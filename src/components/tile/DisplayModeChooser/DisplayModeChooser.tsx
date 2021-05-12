import classNames from "classnames";
import { DisplayModeChooseItem } from "components/display/DisplayModeChooseItem/DisplayModeChooseItem";
import { useStore } from "hooks/useStore";
import { TileTemplate } from "models/tile/TileTemplate";
import React from "react";
import { DisplayModeChooserGrid } from "../DisplayModeChooserGrid/DisplayModeChooserGrid";
import { TileChooserItem } from "../TileChooserItem/TileChooserItem";
import style from "./style.module.css";

const className = style.displayModeChooser;

interface IDisplayModeChooserProps {
    show: boolean;
    onApplyTileDisplayMode: (template: TileTemplate) => void;
    onApplyFloatedDisplayMode: () => void;
    templates: TileTemplate[];
}

export const DisplayModeChooser = (props: IDisplayModeChooserProps) => {
    const store = useStore();

    const handleApplyPreset = (template: TileTemplate) => {
        props.onApplyTileDisplayMode(template);
    };

    return (
        <div className={classNames(className, { [style.show]: props.show })}>
            <DisplayModeChooserGrid>
                {props.templates.map((template) => (
                    <DisplayModeChooseItem key={template.id}>
                        <TileChooserItem
                            key={template.id}
                            onClick={() => handleApplyPreset(template)}
                            template={template}
                            active={false}
                        />
                    </DisplayModeChooseItem>
                ))}
                <DisplayModeChooseItem
                    onClick={props.onApplyFloatedDisplayMode}
                >
                    нет
                </DisplayModeChooseItem>
            </DisplayModeChooserGrid>
        </div>
    );
};
