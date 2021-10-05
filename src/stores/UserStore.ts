import { IJsonRpcResponse, JsonRpcPayload } from "@algont/m7-utils";
import Axios, { AxiosResponse } from "axios";
import { makeAutoObservable } from "mobx";
import { AppStore } from "stores/AppStore";
import { meEndpoint } from "utils/endpoints";
export class UserStore {
    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);
    }

    userName: string = "";

    setUserName(value: string) {
        this.userName = value;
    }

    async fetchUsername() {
        try {
            const userNameResponse = await Axios.post<
                JsonRpcPayload,
                AxiosResponse<IJsonRpcResponse<{ name: string }>>
            >(meEndpoint.url, new JsonRpcPayload("get_me"));
            if (!userNameResponse.data.error) {
                const user = userNameResponse.data.result;
                this.setUserName(user.name);
            }
        } catch (e) {
            console.error(e);
        }
    }
}
