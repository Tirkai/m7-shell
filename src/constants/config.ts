const nodeEnv = process.env.NODE_ENV;

const developmentDomain = "develop-opo";

const [, upperLevelDomain] = window.location.hostname.split(".");

export const AUTH_TOKEN_HEADER = "X-M7-Authorization-Token";

export const TASKBAR_HEIGHT = 48;

export const BASE_WINDOW_WIDTH = 800;
export const BASE_WINDOW_HEIGHT = 600;
export const MIN_WINDOW_HEIGHT = 300;
export const MIN_WINDOW_WIDTH = 400;

export const UPPER_LEVEL_DOMAIN =
    nodeEnv === "development" ? developmentDomain : upperLevelDomain;

export const NOTIFICATIONS_WEBSOCKET_URL = `http://notifications.${UPPER_LEVEL_DOMAIN}/socket.io`;

export const NOTIFICATION_APP_GUID = "be02305e-a748-4b9f-806f-ae95c1cbed0e";
