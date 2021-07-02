import { MarkerType, useMarker } from "@algont/m7-react-marker";
import { SVGIcon } from "@algont/m7-ui";
import { collapse, cross, fullscreen, refresh } from "assets/icons";
import classNames from "classnames";
import { useStore } from "hooks/useStore";
import { IStore } from "interfaces/common/IStore";
import { strings } from "locale";
import { observer } from "mobx-react";
import { ContextMenuItemModel } from "models/contextMenu/ContextMenuItemModel";
import { Point2D } from "models/shape/Point2D";
import React from "react";
import { AppWindowHeaderAction } from "../AppWindowHeaderAction/AppWindowHeaderAction";
import style from "./style.module.css";

interface IAppWindowHeaderProps extends IStore {
    icon: string;
    title: string;
    hasBackward?: boolean;
    hasReload?: boolean;
    isFocused: boolean;
    onDoubleClick?: () => void;
    onClose?: () => void;
    onFullscreen?: () => void;
    onCollapse?: () => void;
    onBackward?: () => void;
    onReload?: () => void;
    visible?: boolean;
}

export const AppWindowHeader = observer((props: IAppWindowHeaderProps) => {
    const store = useStore();

    const { createMemoizedMarker } = useMarker();

    const handleShowContextMenu = (e: React.MouseEvent) => {
        if (props.onReload) {
            store.contextMenu.showContextMenu(new Point2D(e.pageX, e.pageY), [
                new ContextMenuItemModel({
                    icon: <SVGIcon source={refresh} color="white" />,
                    content: strings.application.actions.hardReset,
                    onClick: () =>
                        props.onReload ? props.onReload() : undefined,
                }),
            ]);
        }
    };

    return (
        <div
            className={classNames(
                "appWindowHeader",
                style.appWindowHeader,
                { [style.focused]: props.isFocused },
                { [style.visible]: props.visible },
            )}
            {...createMemoizedMarker(MarkerType.Element, "AppWindowHeader")}
            onDoubleClick={props.onDoubleClick}
        >
            <div className={style.container}>
                <div className={classNames(style.info)}>
                    <div className={style.icon} onClick={handleShowContextMenu}>
                        <SVGIcon
                            source={props.icon}
                            size={{ width: "16px", height: "16px" }}
                            color="#ffffff"
                        />
                    </div>
                    <div
                        className={classNames("appHeaderInfoBar", style.title)}
                    >
                        {props.title}
                    </div>
                </div>
                <div className={style.actions}>
                    {props.onCollapse && (
                        <AppWindowHeaderAction
                            icon={collapse}
                            onClick={props.onCollapse}
                        />
                    )}
                    {props.onFullscreen && (
                        <AppWindowHeaderAction
                            icon={fullscreen}
                            onClick={props.onFullscreen}
                        />
                    )}
                    {props.onClose && (
                        <AppWindowHeaderAction
                            icon={cross}
                            onClick={props.onClose}
                        />
                    )}
                </div>
            </div>
        </div>
    );
});
