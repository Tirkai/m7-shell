export const ru = {
    global: {
        systemName: "M7",
    },
    error: {
        anOccurredError: "Произошла ошибка",
        connectionError: "Не удалось установить соединение с сервером",
        applicationService: "Сервис приложений недоступен",
        noAvailableApplications: "Нет доступных приложений",
        failedGetAvailableApplications:
            "Не удалось получить список доступных приложения для данного пользователя",
    },
    auth: {
        error: {
            authenticateError: "Неверный логин или пароль",
            authenticateUserNotFound: "Пользователь не найден",
            authenticateUserNotActive: "Пользователь не активен",
            authenticateUserExpired: "Срок активности пользователя истек",
            authenticateBadPassword: "Неверный пароль",
            authenticateUnknownNode: "Неизвестный узел",
        },
        description: "Единая служба авторизации",
        action: {
            logout: "Выход",
        },
    },
    search: {
        notFound: "Ничего не найдено",
    },
    actions: {
        login: "Вход",
    },
    form: {
        fields: {
            login: "Логин",
            password: "Пароль",
        },
    },
    state: {
        off: "выключено",
        on: "включено",
        notFound: "Ничего не найдено",
        sessionRecovery: {
            title: "Восстановление сессии",
            content:
                "Восстановление сессии заняло чуть больше времени чем обычно. Проверьте ваше сетевое подключение или авторизуйтесь повторно.",
        },
    },
    startMenu: {
        search: "Поиск",
        licence: "Лицензионная защита",
        logout: "Выйти",
        editAccount: "Изменить профиль",
        devMode: "Режим отладки",
    },
    notification: {
        title: "Уведомления",
        noMoreNotifications: "Нет уведомлений",
    },
    application: {
        actions: {
            close: "Закрыть",
            hardReset: "Перезагрузить",
            refresh: "Обновить",
            fullScreen: "Полноэкранный",
            collapse: "Свернуть",
        },
    },
    definedApplications: {
        license: "Лицензионная защита",
        accountsMe: "Профиль",
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
            title: "Выполнить",
            execute: "Выполнить",
        },
    },
};
