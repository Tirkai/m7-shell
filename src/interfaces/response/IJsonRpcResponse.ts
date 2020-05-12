export interface IJsonRpcResponse<T = unknown> {
    jsonrpc: string;
    id: string;
    result: T;
    error?: {
        code: string;
        message: string;
    };
}
