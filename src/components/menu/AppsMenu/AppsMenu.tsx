import { SVGIcon } from "@algont/m7-ui";
import { search as searchIcon } from "assets/icons";
import classNames from "classnames";
import { ConfigCondition } from "components/config/ConfigCondition/ConfigCondition";
import { AppsMenuTileContainer } from "components/menu/AppsMenuTileContainer/AppsMenuTileContainer";
import { PlaceholderWithIcon } from "components/placeholder/PlaceholderWithIcon/PlaceholderWithIcon";
import { useStore } from "hooks/useStore";
import { strings } from "locale";
import { observer } from "mobx-react";
import { Application } from "models/app/Application";
import { ApplicationPlace } from "models/app/ApplicationPlace";
import { ApplicationRunner } from "models/app/ApplicationRunner";
import { AppsMenuViewMode } from "models/menu/AppsMenuViewMode";
import React, { useEffect, useState } from "react";
import { AppsMenuListContainer } from "../AppsMenuListContainer/AppsMenuListContainer";
import { AppsMenuSearch } from "../AppsMenuSearch/AppsMenuSearch";
import { AppsMenuViewSwitcher } from "../AppsMenuViewSwitcher/AppsMenuViewSwitcher";
import { AppsProfilePreview } from "../AppsProfilePreview/AppsProfilePreview";
import { AppsSettings } from "../AppsSettings/AppsSettings";
import { AppsShellLogo } from "../AppsShellLogo/AppsShellLogo";
import style from "./style.module.css";

export const AppsMenu: React.FC = observer(() => {
    const store = useStore();
    const [search, setSearch] = useState("");
    const [isSearching, setSearching] = useState(false);

    const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);

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
        !store.panelManager.enabledDevMode
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

    const displayedApps = (
        !isSearching
            ? applicationsList
            : applicationsList.filter(
                  (app) =>
                      app.name.toLowerCase().indexOf(search.toLowerCase()) > -1,
              )
    ).filter((app) => !app.isExistedAppInstance);

    useEffect(() => {
        if (store.panelManager.appMenuShow && inputRef) {
            inputRef.focus();
        } else {
            setTimeout(() => setSearch(""), 300);
        }
    }, [store.panelManager.appMenuShow]);

    const { config } = store.config;
    const appsMenuConfig = config.properties.layers.appsMenu;
    return (
        <div
            className={classNames(style.appsMenu, {
                [style.show]: store.panelManager.appMenuShow,
            })}
        >
            <div className={style.container}>
                <ConfigCondition condition={appsMenuConfig.enabled}>
                    <div className={style.sidebar}>
                        <div className={style.sidebarTop}>
                            <ConfigCondition
                                condition={appsMenuConfig.platformMenu.enabled}
                            >
                                <AppsShellLogo apps={shellMenuApps} />
                            </ConfigCondition>
                            <AppsMenuViewSwitcher />
                        </div>
                        <div className={style.sidebarBottom}>
                            <AppsSettings apps={settingsMenuApps} />
                            <ConfigCondition
                                condition={appsMenuConfig.profileMenu.enabled}
                            >
                                <AppsProfilePreview apps={userMenuApps} />
                            </ConfigCondition>
                        </div>
                    </div>
                </ConfigCondition>
                <div className={style.content}>
                    <div className={style.search}>
                        <AppsMenuSearch
                            value={search}
                            onChange={handleSearch}
                            onRefInput={(ref) => setInputRef(ref)}
                        />
                    </div>

                    <div className={style.appsListWrapper}>
                        <div className={style.appsContainer}>
                            {displayedApps.length > 0 && (
                                <div className={style.appsList}>
                                    {store.panelManager.appsMenuViewMode ===
                                        AppsMenuViewMode.List && (
                                        <AppsMenuListContainer
                                            apps={displayedApps}
                                            onExecute={(app) =>
                                                handleExecuteApp(app)
                                            }
                                        />
                                    )}
                                    {store.panelManager.appsMenuViewMode ===
                                        AppsMenuViewMode.Grid && (
                                        <AppsMenuTileContainer
                                            apps={displayedApps}
                                            onExecute={(app) =>
                                                handleExecuteApp(app)
                                            }
                                        />
                                    )}
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
        </div>
    );
});

export default AppsMenu;
