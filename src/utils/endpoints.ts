import { JsonRpcEndpoint } from "./JsonRpcEndpoint";

export const authEndpoint = new JsonRpcEndpoint(
    "http://accounts.c9s/jsonrpc/auth/v2",
);
