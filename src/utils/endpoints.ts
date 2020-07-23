import { JsonRpcEndpoint } from "@algont/m7-utils";
import { UPPER_LEVEL_DOMAIN } from "constants/config";

export const authEndpoint = new JsonRpcEndpoint(
    `http://accounts.${UPPER_LEVEL_DOMAIN}/jsonrpc/auth/v2`,
);

export const meEndpoint = new JsonRpcEndpoint(
    `http://accounts.${UPPER_LEVEL_DOMAIN}/jsonrpc/me/v1`,
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
