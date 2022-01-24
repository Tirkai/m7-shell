import { MarkerType, useMarker } from "@algont/m7-react-marker";
import { SVGIcon } from "@algont/m7-ui";
import { collapse, cross, fullscreen, refresh } from "assets/icons";
import classNames from "classnames";
import { ShellContextMenuItem } from "components/contextMenu/ShellContextMenuItem/ShellContextMenuItem";
import { ContextMenuContext } from "contexts/ContextMenuContext";
import { IStore } from "interfaces/common/IStore";
import { strings } from "locale";
import { NavigationReferer } from "models/navigation/NavigationReferer";
import React, { Fragment, useContext } from "react";
import { AppWindowHeaderAction } from "../AppWindowHeaderAction/AppWindowHeaderAction";
import { AppWindowHeaderReferer } from "../AppWindowHeaderReferer/AppWindowHeaderReferer";
import { AppWindowHeaderTitle } from "../AppWindowHeaderTitle/AppWindowHeaderTitle";
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
    onNavigateToReferer: (referer: NavigationReferer) => void;
    onReload?: () => void;
    visible?: boolean;
    referer?: NavigationReferer;
}

export const AppWindowHeader = (props: IAppWindowHeaderProps) => {
    const { getAnchorPointFromEvent, showMenu, invokeWithClose } =
        useContext(ContextMenuContext);

    const { createMemoizedMarker } = useMarker();

    const handleReload = () => {
        const onReload = props.onReload;
        if (!onReload) {
            return;
        }
        invokeWithClose(() => onReload());
    };

    const handleShowContextMenu = (
        e: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => {
        if (props.onReload) {
            showMenu(
                getAnchorPointFromEvent(e),
                <Fragment>
                    <ShellContextMenuItem
                        icon={<SVGIcon source={refresh} color="white" />}
                        content={strings.application.actions.hardReset}
                        onClick={handleReload}
                    />
                </Fragment>,
            );
        }
    };

    const handleNavigateToReferer = () => {
        if (props.referer) {
            props.onNavigateToReferer(props.referer);
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
                    {props.referer && (
                        <AppWindowHeaderReferer
                            title={props.referer.refererName}
                            onBack={handleNavigateToReferer}
                        />
                    )}

                    <AppWindowHeaderTitle
                        title={props.title}
                        icon={props.icon}
                        onIconClick={handleShowContextMenu}
                    />
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
};
