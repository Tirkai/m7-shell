export const en = {
    global: {
        systemName: "M7",
    },
    error: {
        anOccurredError: "An occurred error",
        connectionError: "Failed to establish a connection to the server",
        applicationService: "App service unavailable",
        noAvailableApplications: "There are no available applications",
        failedGetAvailableApplications:
            "Failed to get the list of available applications for this user",
    },
    auth: {
        error: {
            authenticateError: "Invalid username or password",
            authenticateUserNotFound: "User not found",
            authenticateUserNotActive: "User is not active",
            authenticateUserExpired: "User activity has expired",
            authenticateBadPassword: "Invalid password",
            authenticateUnknownNode: "Unknown node",
        },
        description: "Unified Authorization Service",
        action: {
            logout: "Logout",
        },
    },
    actions: {
        login: "Login",
    },
    form: {
        fields: {
            login: "Login",
            password: "Password",
        },
    },
    state: {
        off: "off",
        on: "on",
        notFound: "Not found",
        sessionRecovery: {
            title: "Session recovery",
            content:
                "Session recovery took a little longer than usual. Check your network connection or login again",
        },
    },
    startMenu: {
        search: "Search",
        licence: "License",
        logout: "Logout",
        editAccount: "Edit Profile",
        devMode: "Dev Mode",
    },
    notification: {
        title: "Notifications",
        noMoreNotifications: "No more notifications",
    },
    application: {
        actions: {
            close: "Close",
            hardReset: "Reset",
            refresh: "Refresh",
            fullScreen: "Fullscreen",
            collapse: "Collapse",
        },
    },
    definedApplications: {
        license: "License",
        accountsMe: "Profile",
    },

    shellApps: {
        launchQueryBuilder: {
            title: "Параметры запуска",
            autoRunTitle: "Автозапуск",
            autoRunType: "Тип автозапуска",
            autoRunApplication: "Приложение",
            autoRunApplicationChoose: "Выбрать",
            autoRunUrl: "URL",
            autoRunFullscreen: "Полноэкранный",
            autoLoginTitle: "Автологин",
            autoLoginFieldLogin: "Логин",
            autoLoginFieldPassword: "Пароль",
            displayModeTitle: "Режим отображения",
            displayModeDefault: "По умолчанию",
            displayModeEmbed: "Встраиваемый",
        },
        customExecutor: {
            title: "Custom Executor",
            execute: "Execute",
        },
    },
};
