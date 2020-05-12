import { JsonRpcEndpoint } from "./JsonRpcEndpoint";

export const authEndpoint = new JsonRpcEndpoint(
    "http://accounts.test1/jsonrpc/auth",
);
