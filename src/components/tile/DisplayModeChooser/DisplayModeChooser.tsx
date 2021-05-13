import classNames from "classnames";
import { DisplayModeChooseItem } from "components/display/DisplayModeChooseItem/DisplayModeChooseItem";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { DisplayMode } from "models/display/DisplayMode";
import { DisplayModeType } from "models/display/DisplayModeType";
import { TileTemplate } from "models/tile/TileTemplate";
import React, { useMemo, useState } from "react";
import { TileChooserItem } from "../TileChooserItem/TileChooserItem";
import style from "./style.module.css";

const className = style.displayModeChooser;

interface IDisplayModeChooserProps {
    // show: boolean;
    // onApplyTileDisplayMode: (template: TileTemplate) => void;
    // onApplyFloatedDisplayMode: () => void;
    // templates: TileTemplate[];
    onSelectTileMode: (
        displayMode: DisplayMode,
        template: TileTemplate,
    ) => void;

    displayMode?: DisplayMode;
    presetAlias?: string;

    onSelectFloatMode: (displayMode: DisplayMode) => void;
}

interface IDisplayModeNavigationItem {
    id: string;
    displayMode: DisplayMode;
    child: React.ReactNode;
    handler: () => void;
}

export const DisplayModeChooser = observer(
    (props: IDisplayModeChooserProps) => {
        const store = useStore();
        const [isShow, setShow] = useState(false);

        const floatDisplayMode = useMemo(
            () => store.display.findDisplayModeByType(DisplayModeType.Float),
            [],
        );

        const tileDisplayMode = useMemo(
            () => store.display.findDisplayModeByType(DisplayModeType.Tile),
            [],
        );

        const handleSelectTileMode = (
            alias: string,
            template: TileTemplate,
        ) => {
            setActiveItem(alias);
            props.onSelectTileMode(tileDisplayMode!, template);
            setShow(false);
        };

        const handleSelectFloatMode = (alias: string) => {
            setActiveItem(alias);
            // if (id !== activeItem) {
            props.onSelectFloatMode(floatDisplayMode!);
            // }
            setShow(false);
        };

        const displayModeNaviagationItems: IDisplayModeNavigationItem[] = useMemo(() => {
            const getTileView = (template: TileTemplate) => (
                <TileChooserItem
                    template={template}
                    onClick={() => false}
                    active={false}
                />
            );

            const getFloatView = () => "нет";

            if (floatDisplayMode && tileDisplayMode) {
                const tiles = store.tile.templates.map((item) => ({
                    id: item.alias,
                    displayMode: tileDisplayMode,
                    child: getTileView(item),
                    handler: () => handleSelectTileMode(item.alias, item),
                }));

                const items = [
                    ...tiles,

                    {
                        id: "none",
                        displayMode: floatDisplayMode,
                        child: getFloatView(),
                        handler: () => handleSelectFloatMode("none"),
                    },
                ];
                return items;
            }
            return [];
        }, []);

        const [activeItem, setActiveItem] = useState(
            props.presetAlias ?? "none",
        );

        return (
            <div className={style.displayModeChooser}>
                <div className={style.preview} onClick={() => setShow(!isShow)}>
                    <DisplayModeChooseItem active={isShow}>
                        {
                            displayModeNaviagationItems.find(
                                (item) => item.id === activeItem,
                            )?.child
                        }
                    </DisplayModeChooseItem>
                </div>
                <div
                    className={classNames(style.container, {
                        [style.show]: isShow,
                    })}
                >
                    <div className={style.content}>
                        {displayModeNaviagationItems
                            .filter((item) => item.id !== activeItem)
                            .map((item) => (
                                <DisplayModeChooseItem onClick={item.handler}>
                                    {item.child}
                                </DisplayModeChooseItem>
                            ))}
                    </div>
                </div>
            </div>
        );
    },
);
