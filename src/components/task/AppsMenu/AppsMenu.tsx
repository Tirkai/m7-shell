import { SVGIcon } from "@algont/m7-ui";
import { search as searchIcon } from "assets/icons";
import classNames from "classnames";
import { BackdropWrapper } from "components/layout/BackdropWrapper/BackdropWrapper";
import { PlaceholderWithIcon } from "components/placeholder/PlaceholderWithIcon/PlaceholderWithIcon";
import { ApplicationPlace } from "enum/ApplicationPlace";
import { useStore } from "hooks/useStore";
import { strings } from "locale";
import { observer } from "mobx-react";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { Application } from "models/Application";
import React, { useState } from "react";
import { AppsMenuItem } from "../AppsMenuItem/AppsMenuItem";
import AppsMenuSearch from "../AppsMenuSearch/AppsMenuSearch";
import { AppsProfilePreview } from "../AppsProfilePreview/AppsProfilePreview";
import { AppsSettings } from "../AppsSettings/AppsSettings";
import { AppsShellLogo } from "../AppsShellLogo/AppsShellLogo";
import style from "./style.module.css";

export const AppsMenu: React.FC = observer(() => {
    const store = useStore();
    const [isShowBackdrop, setShowBackdrop] = useState(false);
    const [search, setSearch] = useState("");
    const [isSearching, setSearching] = useState(false);

    const handleSearch = (value: string) => {
        setSearch(value);
        setSearching(value.length > 0);
    };

    const handleExecuteApp = (app: Application) =>
        new ApplicationRunner(store).run(app, {
            focusWindowAfterInstantiate: true,
        });

    const getFilteredByPlace = (
        apps: Application[],
        place: ApplicationPlace,
        showDefault: boolean = false,
    ) =>
        apps.filter(
            (item) =>
                item.place === place ||
                (showDefault ? item.place === ApplicationPlace.Unknown : false),
        );

    const applicationsList = getFilteredByPlace(
        !store.shell.enabledDevMode
            ? store.applicationManager.displayedApplications
            : store.applicationManager.applications,
        ApplicationPlace.MainMenu,
        true,
    );

    const userMenuApps = getFilteredByPlace(
        store.applicationManager.applications,
        ApplicationPlace.UserMenu,
    );

    const settingsMenuApps = getFilteredByPlace(
        store.applicationManager.applications,
        ApplicationPlace.Settings,
    );

    const shellMenuApps = getFilteredByPlace(
        store.applicationManager.applications,
        ApplicationPlace.M7Menu,
    );

    const displayedApps = (!isSearching
        ? applicationsList
        : applicationsList.filter(
              (app) =>
                  app.name.toLowerCase().indexOf(search.toLowerCase()) > -1,
          )
    ).filter((app) => !app.isExistedAppInstance);

    return (
        <div
            className={classNames(style.appsMenu, {
                [style.show]: store.shell.appMenuShow,
            })}
            onAnimationStart={() => setShowBackdrop(false)}
            onAnimationEnd={() => setShowBackdrop(true)}
        >
            <BackdropWrapper active={isShowBackdrop}>
                <div className={style.container}>
                    <div className={style.sidebar}>
                        <div className={style.sidebarTop}>
                            <AppsShellLogo apps={shellMenuApps} />
                        </div>
                        <div className={style.sidebarBottom}>
                            <AppsSettings apps={settingsMenuApps} />
                            <AppsProfilePreview apps={userMenuApps} />
                        </div>
                    </div>
                    <div className={style.content}>
                        <div className={style.search}>
                            <AppsMenuSearch
                                value={search}
                                onChange={handleSearch}
                            />
                        </div>

                        <div className={style.appsListWrapper}>
                            <div className={style.appsContainer}>
                                {displayedApps.length > 0 && (
                                    <div className={style.appsList}>
                                        {displayedApps.map((app) => (
                                            <AppsMenuItem
                                                key={app.id}
                                                icon={app.icon}
                                                title={app.name}
                                                isExecuted={app.isExecuted}
                                                isAvailable={app.isAvailable}
                                                onClick={() =>
                                                    handleExecuteApp(app)
                                                }
                                            />
                                        ))}
                                    </div>
                                )}
                                {isSearching && displayedApps.length <= 0 && (
                                    <PlaceholderWithIcon
                                        icon={
                                            <SVGIcon
                                                source={searchIcon}
                                                color="white"
                                            />
                                        }
                                        content={strings.search.notFound}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </BackdropWrapper>
        </div>
    );
});

export default AppsMenu;
