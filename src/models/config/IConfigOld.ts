export interface IConfigOld {
    "platform.name": string;
    "platform.alias": string;

    "autoLogin.enabled": string;
    "autoLogin.login": string;
    "autoLogin.password": string;

    "taskbar.enabled": boolean;

    "windows.singleWindow.header.enabled": boolean;

    "foreground.enabled": boolean;
    "tileArea.enabled": boolean;
    "floatArea.enabled": boolean;
    "viewportHub.enabled": boolean;

    // Apps Menu
    "appsMenu.enabled": boolean;
    "appsMenu.sidebar.enabled": boolean;
    "appsMenu.sidebar.platformMenu.enabled": boolean;
    "appsMenu.sidebar.userMenu.enabled": boolean;
    "appsMenu.sidebar.userMenu.profile.enabled": boolean;
    "appsMenu.sidebar.userMenu.logout.enabled": boolean;

    "notifications.enabled": boolean;
    "audioHub.enabled": boolean;
    "recovery.enabled": boolean;

    "dashboard.enabled": boolean;
}
