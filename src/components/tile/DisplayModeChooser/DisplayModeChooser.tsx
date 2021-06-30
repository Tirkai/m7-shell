import { SVGIcon } from "@algont/m7-ui";
import { floatWindowMode } from "assets/icons";
import classNames from "classnames";
import { DisplayModeChooseItem } from "components/display/DisplayModeChooseItem/DisplayModeChooseItem";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { DisplayMode } from "models/display/DisplayMode";
import { DisplayModeType } from "models/display/DisplayModeType";
import { TileTemplate } from "models/tile/TileTemplate";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TileChooserItem } from "../TileChooserItem/TileChooserItem";
import style from "./style.module.css";

const className = style.displayModeChooser;

interface IDisplayModeChooserProps {
    onSelectTileMode: (
        displayMode: DisplayMode,
        template: TileTemplate,
    ) => void;

    displayMode?: DisplayMode;
    presetAlias?: string;
    hash?: string;

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

        const ref = useRef<HTMLDivElement | null>(null);

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
            props.onSelectFloatMode(floatDisplayMode!);
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

            const getFloatView = () => (
                <SVGIcon
                    color="rgb(255,255,255,0.5)"
                    size={{ width: "24px", height: "16px" }}
                    source={floatWindowMode}
                />
            );

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
        }, [props.hash]);

        const [activeItem, setActiveItem] = useState(
            props.displayMode?.type === DisplayModeType.Tile
                ? props.presetAlias
                : "none",
        );

        const handleClickAway = (e: MouseEvent) => {
            const target = e.target as Element;

            if (ref.current && ref.current.contains(target)) {
                return;
            }
            setShow(false);
        };

        useEffect(() => {
            document.addEventListener("mousedown", handleClickAway);

            return () =>
                document.removeEventListener("mousedown", handleClickAway);
        }, []);

        useEffect(() => {
            setActiveItem(
                props.displayMode?.type === DisplayModeType.Tile
                    ? props.presetAlias
                    : "none",
            );
        }, [props.hash]);

        return (
            <div className={style.displayModeChooser} ref={ref}>
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
                                <DisplayModeChooseItem
                                    key={item.id}
                                    onClick={item.handler}
                                >
                                    {item.child}
                                </DisplayModeChooseItem>
                            ))}
                    </div>
                </div>
            </div>
        );
    },
);
