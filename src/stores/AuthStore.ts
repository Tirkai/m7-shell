import { ShellMessageType } from "@algont/m7-shell-emitter";
import Axios from "axios";
import { IAuthResponse } from "interfaces/response/IAuthResponse";
import { IJsonRpcResponse } from "interfaces/response/IJsonRpcResponse";
import { action, observable } from "mobx";
import { ExternalApllication } from "models/ExternalApplication";
import { authEndpoint } from "utils/endpoints";
import { JsonRpcPayload } from "utils/JsonRpcPayload";
import { AppStore } from "./AppStore";
export class AuthStore {
    private readonly localStorageAccessTokenKey: string = "ACCESS_TOKEN";
    private readonly localStorageRefreshTokenKey: string = "REFRESH_TOKEN";
    private readonly localStorageUserLogin: string = "USER_LOGIN";

    accessToken: string = "";
    refreshToken: string = "";
    userLogin: string = "";

    @observable
    isAuthorized: boolean = false;

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        const authToken = localStorage.getItem(this.localStorageAccessTokenKey);
        const refreshToken = localStorage.getItem(
            this.localStorageRefreshTokenKey,
        );
        const userLogin = localStorage.getItem(this.localStorageUserLogin);

        if (authToken && refreshToken && userLogin) {
            this.setToken(authToken, refreshToken);
            this.userLogin = userLogin;
            this.isAuthorized = true;
            this.startUpdateAuthTokenLoop();
        }
    }

    @action
    setToken(authToken: string, refreshToken: string) {
        this.accessToken = authToken;
        this.refreshToken = refreshToken;
        localStorage.setItem(this.localStorageAccessTokenKey, this.accessToken);
        localStorage.setItem(
            this.localStorageRefreshTokenKey,
            this.refreshToken,
        );
        Axios.defaults.headers.common.Authorization = this.accessToken;
    }

    @action
    injectAuthTokenInExternalApplication(app: ExternalApllication) {
        app.emitter.emit(ShellMessageType.UpdateAuthToken, {
            token: this.accessToken,
            login: this.userLogin,
        });
    }

    startUpdateAuthTokenLoop() {
        const updateTokenDelay = 15 * 60 * 1000; // Every 15 minutes
        this.renewToken();
        setInterval(() => {
            this.renewToken();
        }, updateTokenDelay);
    }

    async renewToken() {
        const response = await Axios.post<IJsonRpcResponse<IAuthResponse>>(
            authEndpoint.url,
            new JsonRpcPayload("renew", {
                token: this.refreshToken,
            }),
        );
        if (!response.data.error) {
            const result = response.data.result;
            this.setToken(result.access_token, result.refresh_token);
            this.store.applicationManager.executedApplications.forEach(
                (item) => {
                    if (item instanceof ExternalApllication) {
                        item.emitter.emit(ShellMessageType.UpdateAuthToken, {
                            token: this.accessToken,
                            login: this.userLogin,
                        });
                    }
                },
            );
            console.debug("Update token:", this.accessToken);
        } else {
            this.logout();
        }
    }

    @action
    async login(login: string, password: string) {
        try {
            const response = await Axios.post<IJsonRpcResponse<IAuthResponse>>(
                authEndpoint.url,
                new JsonRpcPayload("login", {
                    login,
                    password,
                }),
            );

            if (!response.data.error) {
                this.setToken(
                    response.data.result.access_token,
                    response.data.result.refresh_token,
                );

                this.isAuthorized = true;
                this.userLogin = login;

                localStorage.setItem(
                    this.localStorageUserLogin,
                    this.userLogin,
                );
                this.startUpdateAuthTokenLoop();
            }
            return response.data;
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
                    token: this.accessToken,
                }),
            );
            localStorage.removeItem(this.localStorageAccessTokenKey);
            this.accessToken = "";
            this.isAuthorized = false;
        } catch (e) {
            alert(e);
        }
    }
}
