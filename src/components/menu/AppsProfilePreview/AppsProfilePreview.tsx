import { SVGIcon } from "@algont/m7-ui";
import { UtilsFunctions } from "@algont/m7-utils";
import { Avatar } from "@material-ui/core";
import { exit } from "assets/icons";
import { ShellContextMenuItem } from "components/contextMenu/ShellContextMenuItem/ShellContextMenuItem";
import { ContextMenuContext } from "contexts/ContextMenuContext";
import { useStore } from "hooks/useStore";
import { strings } from "locale";
import { observer } from "mobx-react";
import { Application } from "models/app/Application";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import React, { Fragment, useContext } from "react";
import { AppsMenuSidebarListItem } from "../AppsMenuSidebarListItem/AppsMenuSidebarListItem";
import style from "./style.module.css";

interface IAppsProfilePreviewProps {
    apps: Application[];
}

export const AppsProfilePreview = observer(
    (props: IAppsProfilePreviewProps) => {
        const store = useStore();
        const { showMenu, transformEventAnchorToPoint, invokeWithClose } =
            useContext(ContextMenuContext);

        const handleExecuteApp = (app: Application) => {
            new ApplicationRunner(store).run(app, {
                focusWindowAfterInstantiate: true,
            });
        };

        const handleShowDropdown = (
            event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        ) => {
            showMenu(
                transformEventAnchorToPoint(event),
                <Fragment>
                    {props.apps.map((app) => (
                        <ShellContextMenuItem
                            onClick={() =>
                                invokeWithClose(() => handleExecuteApp(app))
                            }
                            icon={<SVGIcon source={app.icon} color="white" />}
                            content={app.name}
                        />
                    ))}
                    <ShellContextMenuItem
                        onClick={() => invokeWithClose(() => handleLogout())}
                        icon={<SVGIcon source={exit} color="white" />}
                        content={strings.startMenu.logout}
                    />
                </Fragment>,
            );

            // store.contextMenu.showContextMenu(new Point2D(e.pageX, e.pageY), [
            //     ...props.apps.map(
            //         (app) =>
            //             new ContextMenuItemModel({
            //                 icon: <SVGIcon source={app.icon} color="white" />,
            //                 content: app.name,
            //                 onClick: () => handleExecuteApp(app),
            //             }),
            //     ),
            //     new ContextMenuItemModel({
            //         icon: <SVGIcon source={exit} color="white" />,
            //         content: strings.startMenu.logout,
            //         onClick: handleLogout,
            //     }),
            // ]);
        };

        const handleLogout = () => {
            // setState({ showMenu: false });
            store.auth.logout();
        };

        const userInitials = UtilsFunctions.getInitials(store.user.userName);

        return (
            <AppsMenuSidebarListItem onClick={handleShowDropdown}>
                <div className={style.appsProfilePreview}>
                    <Avatar
                        style={{
                            background: `linear-gradient(-45deg, ${UtilsFunctions.stringToHslColor(
                                userInitials,
                                75,
                                60,
                            )}, ${UtilsFunctions.stringToHslColor(
                                userInitials,
                                75,
                                75,
                            )})`,
                        }}
                        className={style.avatar}
                    >
                        {userInitials}
                    </Avatar>
                </div>
            </AppsMenuSidebarListItem>
        );
    },
);

// @inject("store")
// @observer
// export class AppsProfilePreview extends Component<IAppsProfilePreviewProps> {
//     @computed
//     get store() {
//         return this.props.store!;
//     }

//     handleExecuteApp = (app: Application) => {
//         new ApplicationRunner(this.store).run(app, {
//             focusWindowAfterInstantiate: true,
//         });
//     };

//     handleShowDropdown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//         this.store.contextMenu.showContextMenu(new Point2D(e.pageX, e.pageY), [
//             ...this.props.apps.map(
//                 (app) =>
//                     new ContextMenuItemModel({
//                         icon: <SVGIcon source={app.icon} color="white" />,
//                         content: app.name,
//                         onClick: () => this.handleExecuteApp(app),
//                     }),
//             ),
//             new ContextMenuItemModel({
//                 icon: <SVGIcon source={exit} color="white" />,
//                 content: strings.startMenu.logout,
//                 onClick: this.handleLogout,
//             }),
//         ]);
//     };

//     handleLogout = () => {
//         this.setState({ showMenu: false });
//         this.store.auth.logout();
//     };

//     render() {
//         const userInitials = UtilsFunctions.getInitials(
//             this.store.user.userName,
//         );

//         return (
//             <AppsMenuSidebarListItem onClick={this.handleShowDropdown}>
//                 <div className={style.appsProfilePreview}>
//                     <Avatar
//                         style={{
//                             background: `linear-gradient(-45deg, ${UtilsFunctions.stringToHslColor(
//                                 userInitials,
//                                 75,
//                                 60,
//                             )}, ${UtilsFunctions.stringToHslColor(
//                                 userInitials,
//                                 75,
//                                 75,
//                             )})`,
//                         }}
//                         className={style.avatar}
//                     >
//                         {userInitials}
//                     </Avatar>
//                 </div>
//             </AppsMenuSidebarListItem>
//         );
//     }
// }
