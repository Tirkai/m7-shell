import { BrokerMessageType } from "@algont/m7-shell-broker";
import Axios from "axios";
import { IJsonRpcResponse } from "interfaces/response/IJsonRpcResponse";
import { action, observable } from "mobx";
import { ExternalApllication } from "models/ExternalApplication";
import { authEndpoint } from "utils/endpoints";
import { JsonRpcPayload } from "utils/JsonRpcPayload";
import { AppStore } from "./AppStore";
export class AuthStore {
    private readonly localStorageTokenKey: string = "TOKEN";
    jwtToken: string = "";

    @observable
    isAuthorized: boolean = false;

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        const token = localStorage.getItem(this.localStorageTokenKey);
        if (token) {
            this.setToken(token);
            this.isAuthorized = true;
        }
    }

    @action
    setToken(token: string) {
        this.jwtToken = token;
        localStorage.setItem(this.localStorageTokenKey, this.jwtToken);
        Axios.defaults.headers.common.Authorization = this.jwtToken;
    }

    @action
    injectAuthTokenInExternalApplication(app: ExternalApllication) {
        app.broker.dispatch(BrokerMessageType.UpdateAuthToken, this.jwtToken);
    }

    @action
    async login(login: string, password: string) {
        try {
            const response = await Axios.post<IJsonRpcResponse<string>>(
                authEndpoint.url,
                new JsonRpcPayload("login", {
                    login,
                    password,
                    parameters: {},
                }),
            );

            if (!response.data.error) {
                this.setToken(response.data.result);
                this.isAuthorized = true;
            } else {
                alert(response.data.error.message);
            }
        } catch (e) {
            alert(e);
        }
    }

    @action
    async logout() {
        try {
            await Axios.post(
                authEndpoint.url,
                new JsonRpcPayload("logout", {
                    token: this.jwtToken,
                }),
            );
            localStorage.removeItem(this.localStorageTokenKey);
            this.jwtToken = "";
            this.isAuthorized = false;
        } catch (e) {
            alert(e);
        }
    }
}
