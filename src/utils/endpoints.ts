import { UPPER_LEVEL_DOMAIN } from "constants/config";
import { JsonRpcEndpoint } from "./JsonRpcEndpoint";

export const authEndpoint = new JsonRpcEndpoint(
    `http://accounts.${UPPER_LEVEL_DOMAIN}/jsonrpc/auth/v2`,
);

export const portalEndpoint = new JsonRpcEndpoint(
    `http://m7.${UPPER_LEVEL_DOMAIN}/jsonrpc/portal`,
);

export const legacyNotificationEndpoint = new JsonRpcEndpoint(
    `http://notifications.${UPPER_LEVEL_DOMAIN}/service`,
);

export const notificationsEndpoint = new JsonRpcEndpoint(
    `http://notifications.${UPPER_LEVEL_DOMAIN}/jsonrpc/notify/v2`,
);
