import { UPPER_LEVEL_DOMAIN } from "constants/config";
import { JsonRpcEndpoint } from "./JsonRpcEndpoint";

export const authEndpoint = new JsonRpcEndpoint(
    `http://accounts.${UPPER_LEVEL_DOMAIN}/jsonrpc/auth/v2`,
);
