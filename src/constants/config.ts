import { strings } from "locale";
import { IConfig } from "models/config/IConfig";

const nodeEnv = process.env.NODE_ENV;

const developmentDomain = "zab";

const [, upperLevelDomain] = window.location.hostname.split(".");

export const AUTH_TOKEN_HEADER: string = "X-M7-Authorization-Token";

export const TASKBAR_HEIGHT = 48;

export const BASE_WINDOW_WIDTH = 800;
export const BASE_WINDOW_HEIGHT = 600;
export const MIN_WINDOW_HEIGHT = 300;
export const MIN_WINDOW_WIDTH = 400;

export const UPPER_LEVEL_DOMAIN =
    nodeEnv === "development" ? developmentDomain : upperLevelDomain;

export const NOTIFICATIONS_WEBSOCKET_URL = `http://notifications.${UPPER_LEVEL_DOMAIN}/socket.io`;

export const NOTIFICATION_APP_GUID = "be02305e-a748-4b9f-806f-ae95c1cbed0e";

export const defaultConfig: IConfig = {
    name: "default",
    properties: {
        platform: {
            name: "M7",
            alias: "M7",
        },
        autoLogin: {
            enabled: false,
            login: "",
            password: "",
        },
        windows: {
            singleWindow: {
                header: {
                    enabled: true,
                },
            },
        },
        layers: {
            authScreen: {
                enabled: true,
                logoUrl: "/logo.svg",
                description: strings.auth.description,
            },
            taskbar: {
                enabled: true,
            },

            foreground: {
                enabled: true,
            },
            tileArea: {
                enabled: true,
            },
            floatArea: {
                enabled: true,
            },
            viewportHub: {
                enabled: true,
            },
            appsMenu: {
                enabled: true,
                sidebar: {
                    enabled: true,
                    platformMenu: {
                        enabled: true,
                    },
                    userMenu: {
                        enabled: true,
                    },
                    profileMenu: {
                        profile: {
                            enabled: true,
                        },
                        logout: {
                            enabled: true,
                        },
                    },
                },
            },
            notifications: {
                enabled: true,
            },
            audioHub: {
                enabled: true,
            },
            recovery: {
                enabled: true,
            },
            dashboard: {
                enabled: false,
            },
        },
    },
};
