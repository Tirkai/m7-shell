import {
    IJsonRpcResponse,
    JsonRpcFailure,
    JsonRpcPayload,
    JsonRpcSuccess,
    NullableJsonRpcResult,
} from "@algont/m7-utils";
import Axios from "axios";
import { makeAutoObservable } from "mobx";
import { UserDatabaseEventType } from "models/userDatabase/UserDatabaseEventType";
import { UserDatabasePropKey } from "models/userDatabase/UserDatabasePropKey";
import { AppStore } from "stores/AppStore";
import { userDataEndpoint } from "utils/endpoints";

interface IUserDatabasePropPayload<T> {
    name: UserDatabasePropKey;
    value: T;
}

export class UserDatabaseManager {
    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;
        makeAutoObservable(this);
    }

    async load<T>(
        names: UserDatabasePropKey[],
    ): Promise<NullableJsonRpcResult<T>> {
        try {
            const response = await Axios.post<IJsonRpcResponse<T>>(
                userDataEndpoint.url,
                new JsonRpcPayload("get_values", { names }),
            );

            if (!response.data.error) {
                this.store.sharedEventBus.eventBus.dispatch(
                    UserDatabaseEventType.OnLoadProperty,
                    response.data.result,
                );

                return new JsonRpcSuccess(response.data.result);
            }
            return new JsonRpcFailure();
        } catch (e) {
            return new JsonRpcFailure();
        }
    }

    async save<T>(
        payload: IUserDatabasePropPayload<T>[],
    ): Promise<NullableJsonRpcResult<any>> {
        try {
            const body = Object.fromEntries(
                payload.map((item) => [item.name, item.value]),
            );

            const response = await Axios.post<IJsonRpcResponse<T>>(
                userDataEndpoint.url,
                new JsonRpcPayload("set_values", {
                    values: body,
                }),
            );

            if (!response.data.error) {
                this.store.sharedEventBus.eventBus.dispatch(
                    UserDatabaseEventType.OnSaveProperty,
                    response.data.result,
                );
                return new JsonRpcSuccess(response.data.result);
            }
            return new JsonRpcFailure();
        } catch (e) {
            console.error(e);
            return new JsonRpcFailure();
        }
    }
}
