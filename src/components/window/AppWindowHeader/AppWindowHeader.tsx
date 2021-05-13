import { SVGIcon } from "@algont/m7-ui";
import { collapse, cross, fullscreen, refresh } from "assets/icons";
import classNames from "classnames";
import { IStore } from "interfaces/common/IStore";
import { strings } from "locale";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { ContextMenuItemModel } from "models/ContextMenuItemModel";
import { Point2D } from "models/Point2D";
import React, { Component } from "react";
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

@inject("store")
@observer
export class AppWindowHeader extends Component<IAppWindowHeaderProps> {
    @computed
    get store() {
        return this.props.store!;
    }

    handleShowContextMenu = (e: React.MouseEvent) => {
        if (this.props.onReload) {
            this.store.contextMenu.showContextMenu(
                new Point2D(e.pageX, e.pageY),
                [
                    new ContextMenuItemModel({
                        icon: refresh,
                        content: strings.application.actions.hardReset,
                        onClick: this.props.onReload,
                    }),
                ],
            );
        }
    };

    handleCollapse = () => {
        if (this.props.onCollapse) {
            this.props.onCollapse();
        }
    };

    handleFullscreen = () => {
        if (this.props.onFullscreen) {
            this.props.onFullscreen();
        }
    };

    handleClose = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
    };

    render() {
        return (
            <div
                className={classNames(
                    "appWindowHeader",
                    style.appWindowHeader,
                    { [style.focused]: this.props.isFocused },
                    { [style.visible]: this.props.visible },
                )}
                onDoubleClick={this.props.onDoubleClick}
            >
                <div className={style.container}>
                    <div className={classNames("appHeaderInfoBar", style.info)}>
                        <div
                            className={style.icon}
                            onClick={this.handleShowContextMenu}
                        >
                            <SVGIcon
                                source={this.props.icon}
                                size={{ width: "16px", height: "16px" }}
                                color="#ffffff"
                            />
                        </div>
                        <div className={style.title}>{this.props.title}</div>
                    </div>
                    <div className={style.actions}>
                        {this.props.onCollapse && (
                            <AppWindowHeaderAction
                                icon={collapse}
                                onClick={this.props.onCollapse}
                            />
                        )}
                        {this.props.onFullscreen && (
                            <AppWindowHeaderAction
                                icon={fullscreen}
                                onClick={this.props.onFullscreen}
                            />
                        )}
                        {this.props.onClose && (
                            <AppWindowHeaderAction
                                icon={cross}
                                onClick={this.props.onClose}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
