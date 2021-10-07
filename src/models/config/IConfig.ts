import { PerformanceModeType } from "models/performance/PerformanceModeType";

export interface IConfig {
    name: string;
    extend?: string;
    properties: {
        platform: {
            name: string;
            alias: string;
            favicon: {
                url: string;
            };
        };
        autoLogin: {
            enabled: boolean;
            login: string;
            password: string;
        };

        windows: {
            singleWindow: {
                header: {
                    enabled: boolean;
                };
            };
        };

        performance: {
            mode: PerformanceModeType;
        };

        layers: {
            authScreen: {
                enabled: boolean;
                logo: {
                    url: string;
                };
                wallpaper: {
                    url: string;
                };
                description: string;
            };
            taskbar: {
                enabled: boolean;
            };
            foreground: {
                enabled: boolean;
                wallpaper: {
                    url: string;
                };
            };
            tileArea: {
                enabled: boolean;
            };
            floatArea: {
                enabled: boolean;
            };
            viewportHub: {
                enabled: boolean;
            };
            appsMenu: {
                enabled: boolean;
                platformMenu: {
                    enabled: boolean;
                    logo: {
                        url: string;
                    };
                };
                userMenu: {
                    enabled: boolean;
                };
                profileMenu: {
                    enabled: boolean;
                    profile: {
                        enabled: boolean;
                    };
                    logout: {
                        enabled: boolean;
                    };
                };
            };
            notifications: {
                enabled: boolean;
            };
            audioHub: {
                enabled: boolean;
            };
            recovery: {
                enabled: boolean;
            };
            dashboard: {
                enabled: boolean;
            };
        };
    };
}
