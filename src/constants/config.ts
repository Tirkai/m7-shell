const nodeEnv = process.env.NODE_ENV;

const developmentDomain = "algonttest";

const [, upperLevelDomain] = window.location.hostname.split(".");

export const AUTH_TOKEN_HEADER = "X-M7-Authorization-Token";

export const TASKBAR_HEIGHT = 48;

export const UPPER_LEVEL_DOMAIN =
    nodeEnv === "development" ? developmentDomain : upperLevelDomain;

export const NOTIFICATIONS_WEBSOCKET_URL = `http://notifications.${UPPER_LEVEL_DOMAIN}/socket.io`;
