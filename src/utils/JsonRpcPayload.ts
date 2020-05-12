import { v4 } from "uuid";

export class JsonRpcPayload<T = {}> {
    jsonrpc: string = "2.0";
    id: string;
    method: string;
    params: T | null = null;
    constructor(method: string, params?: T) {
        this.id = v4();
        this.method = method;
        if (params) {
            this.params = params;
        }
    }
}
