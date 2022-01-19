import { SVGIcon } from "@algont/m7-ui";
import { Avatar } from "@material-ui/core";
import { ShellContextMenuItem } from "components/contextMenu/ShellContextMenuItem/ShellContextMenuItem";
import { ContextMenuContext } from "contexts/ContextMenuContext";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { Application } from "models/app/Application";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import React, { Fragment, useContext } from "react";
import { AppsMenuSidebarListItem } from "../AppsMenuSidebarListItem/AppsMenuSidebarListItem";
import style from "./style.module.css";

interface IAppsShellLogoProps {
    apps: Application[];
}

export const AppsShellLogo = observer((props: IAppsShellLogoProps) => {
    const store = useStore();
    const { showMenu, invokeWithClose, transformEventAnchorToPoint } =
        useContext(ContextMenuContext);

    const handleExecuteApp = (app: Application) => {
        new ApplicationRunner(store).run(app, {
            focusWindowAfterInstantiate: true,
        });
    };

    const handleShowMenu = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        showMenu(
            transformEventAnchorToPoint(e),
            <Fragment>
                {props.apps
                    .filter((app) => !app.isOnlyAdmin || store.auth.isAdmin)
                    .map((app) => (
                        <ShellContextMenuItem
                            icon={<SVGIcon source={app.icon} color="white" />}
                            content={app.name}
                            onClick={() =>
                                invokeWithClose(() => handleExecuteApp(app))
                            }
                        />
                    ))}
            </Fragment>,
        );
    };
    const { config } = store.config;

    return (
        <AppsMenuSidebarListItem onClick={handleShowMenu}>
            <div className={style.appsShellLogo}>
                <Avatar className={style.avatar}>
                    <img
                        src={
                            config.properties.layers.appsMenu.platformMenu.logo
                                .url
                        }
                    />
                </Avatar>
            </div>
        </AppsMenuSidebarListItem>
    );
});
