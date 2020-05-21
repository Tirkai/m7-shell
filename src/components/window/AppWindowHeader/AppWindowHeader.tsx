import { backward, collapse, cross, fullscreen } from "assets/icons";
import classNames from "classnames";
import React, { Component } from "react";
import { AppWindowHeaderAction } from "../AppWindowHeaderAction/AppWindowHeaderAction";
import style from "./style.module.css";

interface IAppWindowHeaderProps {
    icon: string;
    title: string;
    hasBackward?: boolean;
    hasReload?: boolean;
    onDoubleClick?: () => void;
    onClose: () => void;
    onFullscreen: () => void;
    onCollapse: () => void;
    onBackward: () => void;
    onReload: () => void;
}

export class AppWindowHeader extends Component<IAppWindowHeaderProps> {
    render() {
        return (
            <div
                className={classNames("appWindowHeader", style.appWindowHeader)}
                onDoubleClick={this.props.onDoubleClick}
            >
                <div className={style.container}>
                    <div className={style.actions}>
                        {this.props.hasBackward ? (
                            <AppWindowHeaderAction
                                icon={backward}
                                onClick={this.props.onBackward}
                            />
                        ) : (
                            ""
                        )}
                        {this.props.hasReload ? (
                            <AppWindowHeaderAction
                                icon={backward}
                                onClick={this.props.onReload}
                            />
                        ) : (
                            ""
                        )}
                    </div>
                    <div className={classNames("appHeaderInfoBar", style.info)}>
                        <div className={style.icon}>
                            <img src={this.props.icon} alt="App Icon" />
                        </div>
                        <div className={style.title}>{this.props.title}</div>
                    </div>
                    <div className={style.actions}>
                        <AppWindowHeaderAction
                            icon={collapse}
                            onClick={this.props.onCollapse}
                        />
                        <AppWindowHeaderAction
                            icon={fullscreen}
                            onClick={this.props.onFullscreen}
                        />
                        <AppWindowHeaderAction
                            icon={cross}
                            onClick={this.props.onClose}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default AppWindowHeader;
