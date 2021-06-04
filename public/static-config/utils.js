window.shellConfig = {};

window.extendConfig = (from, overridedConfig) => {
    try {
        return {
            ...window.shellConfig[from],
            ...overridedConfig,
        };
    } catch (e) {
        console.error(`Extend config failed`, { from, overridedConfig });
    }
};

window.createConfig = (configName, configValue) => {
    try {
        window.shellConfig[configName] = configValue;
    } catch (e) {
        console.error(`Create config failed`, { configName, configValue });
    }
};
