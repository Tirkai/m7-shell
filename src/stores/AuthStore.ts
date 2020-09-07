import { ShellMessageType } from "@algont/m7-shell-emitter";
import { JsonRpcPayload, JsonRpcResult } from "@algont/m7-utils";
import Axios from "axios";
import { AUTH_TOKEN_HEADER } from "constants/config";
import { AccessTokenVerifyStatus } from "enum/AccessTokenVerifyStatus";
import { ShellEvents } from "enum/ShellEvents";
import { IRefrashTokenMetadata } from "interfaces/auth/IRefreshTokenMetadata";
import { IAuthResponse } from "interfaces/response/IAuthResponse";
import { IJsonRpcResponse } from "interfaces/response/IJsonRpcResponse";
import { Base64 } from "js-base64";
import { strings } from "locale";
import { action, computed, observable } from "mobx";
import { ExternalApllication } from "models/ExternalApplication";
import moment, { Moment } from "moment";
import { authEndpoint, meEndpoint } from "utils/endpoints";
import { AppStore } from "./AppStore";

export class AuthStore {
    private readonly localStorageAccessTokenKey: string =
        "ACCESS_TOKEN_" + process.env.REACT_APP_BUILD;
    private readonly localStorageRefreshTokenKey: string =
        "REFRESH_TOKEN_" + process.env.REACT_APP_BUILD;
    private readonly localStorageUserLogin: string = "USER_LOGIN";
    private readonly localStorageDelta: string =
        "DELTA_" + process.env.REACT_APP_BUILD;
    @observable
    accessToken: string = "";

    @observable
    refreshToken: string = "";

    @observable
    userLogin: string = "";

    @observable
    userName: string = "";

    @observable
    isAuthorized: boolean = false;

    @observable
    deltaTime: number = 0;

    @observable
    renewTime: Moment = moment();

    @observable
    createTime: Moment = moment();

    @observable
    currentTime: Moment = moment();

    @observable
    timeOffset: number = 30000;

    decodeToken<T>(token: string) {
        const [, expireSection] = token.split(".");

        if (expireSection) {
            const decodedData = (JSON.parse(
                Base64.decode(expireSection),
            ) as unknown) as T;
            return decodedData;
        } else {
            return null;
        }
    }

    @computed
    get remainingTokenTime() {
        const time = -this.currentTime.diff(this.renewTime) + this.deltaTime;
        return !isNaN(time) ? time : 0;
    }

    @computed
    get remainingTokenTimeInSeconds() {
        return Math.floor((this.remainingTokenTime + this.timeOffset) / 1000);
    }

    @computed
    get isTokenExpired() {
        return this.remainingTokenTime <= 0;
    }

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
            this.fetchUsername();
        }

        const checkoutRemainingTime = () => {
            const diff =
                this.renewTime.diff(this.currentTime) +
                this.deltaTime +
                this.timeOffset;
            return diff >= 0;
        };

        window.addEventListener("focus", () => checkoutRemainingTime());

        setInterval(() => {
            this.currentTime = moment();
            if (this.isAuthorized) {
                const hasRemainedTime = checkoutRemainingTime();
                if (!hasRemainedTime) {
                    this.renewToken();
                }
            }
        }, 1000);
    }

    async verifyToken() {
        const response = await Axios.post<
            IJsonRpcResponse<AccessTokenVerifyStatus>
        >(
            authEndpoint.url,
            new JsonRpcPayload("verify", {
                token: this.accessToken,
            }),
        );

        return new JsonRpcResult({
            status: !response.data.error,
            result: response.data.result === AccessTokenVerifyStatus.Ok,
        });
    }

    @action
    setToken(accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;

        const refreshTokenData = this.decodeToken<IRefrashTokenMetadata>(
            refreshToken,
        );

        this.createTime = moment.utc(refreshTokenData?.created);
        this.renewTime = moment.utc(refreshTokenData?.renew);

        const localStorageDelta = localStorage.getItem(this.localStorageDelta);

        if (!localStorageDelta) {
            this.deltaTime = this.currentTime.diff(this.createTime);
            localStorage.setItem(
                this.localStorageDelta,
                this.deltaTime.toString(),
            );
        } else {
            this.deltaTime = parseInt(localStorageDelta);
        }

        const delay = this.remainingTokenTime + this.timeOffset;
        localStorage.setItem(this.localStorageAccessTokenKey, this.accessToken);

        localStorage.setItem(
            this.localStorageRefreshTokenKey,
            this.refreshToken,
        );
        Axios.defaults.headers.common[AUTH_TOKEN_HEADER] = this.accessToken;
    }

    @action
    injectAuthTokenInExternalApplication(app: ExternalApllication) {
        app.emitter.emit(ShellMessageType.UpdateAuthToken, {
            token: this.accessToken,
            login: this.userLogin,
        });
    }

    async renewToken() {
        const response = await Axios.post<IJsonRpcResponse<IAuthResponse>>(
            authEndpoint.url,
            new JsonRpcPayload("renew", {
                token: this.refreshToken,
            }),
        );
        localStorage.removeItem(this.localStorageDelta);
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

                this.fetchUsername();
            }
            return response.data;
        } catch (e) {
            this.store.message.showMessage(
                strings.error.anOccurredError,
                strings.error.connectionError,
            );
        }
    }

    @action
    async fetchUsername() {
        const userNameResponse = await Axios.post<
            IJsonRpcResponse<{ name: string }>
        >(meEndpoint.url, new JsonRpcPayload("get_me"));
        if (!userNameResponse.data.error) {
            const user = userNameResponse.data.result;
            this.userName = user.name;
        }
    }

    @action
    async logout() {
        try {
            const response = await Axios.post<IJsonRpcResponse<unknown>>(
                authEndpoint.url,
                new JsonRpcPayload("logout", {
                    token: this.accessToken,
                }),
            );

            dispatchEvent(new CustomEvent(ShellEvents.Logout));

            localStorage.removeItem(this.localStorageAccessTokenKey);
            this.accessToken = "";
            this.isAuthorized = false;

            return new JsonRpcResult({
                status: !response.data.error,
            });
        } catch (e) {
            this.isAuthorized = false;
            this.store.message.showMessage(
                strings.error.anOccurredError,
                strings.error.connectionError,
            );
        }
    }
}
