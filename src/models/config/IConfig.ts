export interface IConfig {
    name: string;
    properties: {
        platform: {
            name: string;
            alias: string;
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

        layers: {
            authScreen: {
                enabled: boolean;
                logoUrl: string;
                description: string;
            };
            taskbar: {
                enabled: boolean;
            };
            foreground: {
                enabled: boolean;
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
                sidebar: {
                    enabled: boolean;
                    platformMenu: {
                        enabled: boolean;
                    };
                    userMenu: {
                        enabled: boolean;
                    };
                    profileMenu: {
                        profile: {
                            enabled: boolean;
                        };
                        logout: {
                            enabled: boolean;
                        };
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
