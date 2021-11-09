import {
    IJsonRpcResponse,
    JsonRpcPayload,
    JsonRpcResult,
} from "@algont/m7-utils";
import Axios, { AxiosResponse } from "axios";
import { AUTH_TOKEN_HEADER } from "constants/config";
import { ExternalEventType } from "external/ExternalEventType";
import { IAccessTokenMetadata } from "interfaces/auth/IAccessTokenMetadata";
import { IRefreshTokenMetadata } from "interfaces/auth/IRefreshTokenMetadata";
import { IAuthResponse } from "interfaces/response/IAuthResponse";
import { Base64 } from "js-base64";
import { strings } from "locale";
import { makeAutoObservable } from "mobx";
import { AccessTokenVerifyStatus } from "models/auth/AccessTokenVerifyStatus";
import { AuthEventType } from "models/auth/AuthEventType";
import { RoleType } from "models/role/RoleType";
import moment, { Moment } from "moment";
import { authEndpoint, meEndpoint } from "utils/endpoints";
import { AppStore } from "./AppStore";

export class AuthStore {
    private readonly sessionStorageAccessTokenKey: string = "ACCESS_TOKEN";
    private readonly sessionStorageRefreshTokenKey: string = "REFRESH_TOKEN";
    private readonly sessionStorageUserLogin: string = "USER_LOGIN";
    private readonly sessionStorageDelta: string = "DELTA";

    accessToken: string = "";

    refreshToken: string = "";

    userLogin: string = "";

    userName: string = "";

    roles: RoleType[] = [];

    isAuthorized: boolean = false;

    deltaTime: number = 0;

    renewTime: Moment = moment();

    createTime: Moment = moment();

    currentTime: Moment = moment();

    timeOffset: number = 30000;

    checkedAfterStart: boolean = false;

    eventBus: EventTarget = new EventTarget();

    get isAdmin() {
        return this.roles.some((item) => item === RoleType.Admin);
    }

    get isSysadmin() {
        return this.roles.some((item) => item === RoleType.Sysadmin);
    }

    decodeToken<T>(token: string) {
        const [, tokenPayload] = token.split(".");

        if (tokenPayload) {
            const decodedData = JSON.parse(
                Base64.decode(tokenPayload),
            ) as unknown as T;
            return decodedData;
        } else {
            return null;
        }
    }

    isUpdateTokenProcessActive: boolean = false;

    interval: NodeJS.Timeout | null = null;

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);

        const authToken = sessionStorage.getItem(
            this.sessionStorageAccessTokenKey,
        );
        const refreshToken = sessionStorage.getItem(
            this.sessionStorageRefreshTokenKey,
        );
        const userLogin = sessionStorage.getItem(this.sessionStorageUserLogin);

        if (authToken && refreshToken && userLogin) {
            this.setToken(authToken, refreshToken);
            this.userLogin = userLogin;
            this.isAuthorized = true;
            this.fetchUsername();
            this.init();
        }

        window.addEventListener("focus", () => {
            if (this.isAuthorized) {
                this.verifyToken();
            }
        });

        if (this.isAuthorized) {
            this.verifyToken();
        }

        this.store.sharedEventBus.eventBus.add(
            ExternalEventType.OnLogoutExternalMessage,
            () => this.logout(),
        );
    }

    checkoutRemainingTime() {
        const diff = this.currentTime.diff(this.renewTime) - this.timeOffset;

        return diff <= 0;
    }

    init() {
        this.interval = setInterval(() => {
            this.setCurrentTime(moment());
            if (this.isAuthorized) {
                const hasRemainedTime = this.checkoutRemainingTime();
                if (!hasRemainedTime) {
                    if (!this.isUpdateTokenProcessActive) {
                        this.renewToken();
                    }
                }
            }
        }, 1000);

        this.store.sharedEventBus.eventBus.dispatch(AuthEventType.OnLogin);
    }

    async verifyToken() {
        const { eventBus } = this.store.sharedEventBus;
        try {
            const response = await Axios.post<
                JsonRpcPayload,
                AxiosResponse<IJsonRpcResponse<AccessTokenVerifyStatus>>
            >(
                authEndpoint.url,
                new JsonRpcPayload("verify", {
                    token: this.accessToken,
                }),
            );

            if (!response.data.error) {
                this.setCheckedAfterStart(true);

                eventBus.dispatch(
                    AuthEventType.OnSuccessVerifyToken,
                    this.accessToken,
                );
            } else {
                eventBus.dispatch(
                    AuthEventType.OnFailedVerifyToken,
                    this.accessToken,
                );
            }

            if (response.data.result === AccessTokenVerifyStatus.Expired) {
                this.renewToken();
            }
            if (response.data.result === AccessTokenVerifyStatus.NotFound) {
                eventBus.dispatch(
                    AuthEventType.OnTokenNotFound,
                    this.accessToken,
                );
                this.logout();
            }

            return new JsonRpcResult({
                status: !response.data.error,
                result: response.data.result === AccessTokenVerifyStatus.Ok,
            });
        } catch (e) {
            eventBus.dispatch(
                AuthEventType.OnFailedVerifyToken,
                this.accessToken,
            );

            return new JsonRpcResult({
                status: false,
            });
        }
    }

    setToken(accessToken: string, refreshToken: string) {
        const { eventBus } = this.store.sharedEventBus;
        try {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;

            const refreshTokenData =
                this.decodeToken<IRefreshTokenMetadata>(refreshToken);

            const accessTokenData =
                this.decodeToken<IAccessTokenMetadata>(accessToken);

            eventBus.dispatch(AuthEventType.OnRecieveToken, {
                token: this.accessToken,
                login: this.userLogin,
            });

            this.roles = accessTokenData?.roles ?? [];

            this.createTime = moment.utc(refreshTokenData?.created);
            this.renewTime = moment.utc(refreshTokenData?.renew);

            const sessionStorageDelta = sessionStorage.getItem(
                this.sessionStorageDelta,
            );

            eventBus.dispatch(AuthEventType.OnUpdateToken, this.accessToken);

            if (!sessionStorageDelta) {
                this.deltaTime = this.currentTime.diff(this.createTime);
                sessionStorage.setItem(
                    this.sessionStorageDelta,
                    this.deltaTime.toString(),
                );
            } else {
                this.deltaTime = parseInt(sessionStorageDelta);
            }

            sessionStorage.setItem(
                this.sessionStorageAccessTokenKey,
                this.accessToken,
            );

            sessionStorage.setItem(
                this.sessionStorageRefreshTokenKey,
                this.refreshToken,
            );

            if (Axios.defaults?.headers?.common) {
                // const t = AUTH_TOKEN_HEADER;
                Axios.defaults.headers[AUTH_TOKEN_HEADER] = this.accessToken;
            }
        } catch (e) {
            console.error(e);
        }
    }

    async renewToken() {
        const { eventBus } = this.store.sharedEventBus;
        try {
            this.isUpdateTokenProcessActive = true;

            const response = await Axios.post<
                JsonRpcPayload,
                AxiosResponse<IJsonRpcResponse<IAuthResponse>>
            >(
                authEndpoint.url,
                new JsonRpcPayload("renew", {
                    token: this.refreshToken,
                }),
            );
            sessionStorage.removeItem(this.sessionStorageDelta);
            if (!response.data.error) {
                const result = response.data.result;
                this.setToken(result.access_token, result.refresh_token);

                eventBus.dispatch(AuthEventType.OnRenewToken, {
                    token: this.accessToken,
                    login: this.userLogin,
                });
                eventBus.dispatch(AuthEventType.OnRecieveToken, {
                    token: this.accessToken,
                    login: this.userLogin,
                });
            } else {
                if (parseInt(response.data.error.code) === -2006) {
                    return;
                }

                eventBus.dispatch(AuthEventType.OnFailedRenewToken);

                this.logout();
            }
        } catch (e) {
            console.error(e);
        } finally {
            this.isUpdateTokenProcessActive = false;
        }
    }

    async login(login: string, password: string) {
        // #region
        // Отключение режима отладки при входе другого пользователя
        // Фикс для версии 0.26.1
        // Не вливать в основной develop, так как в
        // более новых версиях это будет реализовано на EventBus
        this.store.shell.setDevMode(false);
        // #endregion

        try {
            const response = await Axios.post<
                JsonRpcPayload,
                AxiosResponse<IJsonRpcResponse<IAuthResponse>>
            >(
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

                this.setUserLogin(login);
                this.setAuthorized(true);
                this.setCheckedAfterStart(true);

                sessionStorage.setItem(
                    this.sessionStorageUserLogin,
                    this.userLogin,
                );

                this.fetchUsername();
            }
            this.init();

            return response.data;
        } catch (e) {
            this.store.message.showMessage(
                strings.error.anOccurredError,
                strings.error.connectionError,
            );
        }
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

    async logout() {
        const { eventBus } = this.store.sharedEventBus;
        try {
            const response = await Axios.post<
                JsonRpcPayload,
                AxiosResponse<IJsonRpcResponse<unknown>>
            >(
                authEndpoint.url,
                new JsonRpcPayload("logout", {
                    token: this.accessToken,
                }),
            );

            eventBus.dispatch(AuthEventType.OnLogout);

            sessionStorage.removeItem(this.sessionStorageAccessTokenKey);
            sessionStorage.removeItem(this.sessionStorageRefreshTokenKey);

            this.accessToken = "";
            this.refreshToken = "";
            this.deltaTime = 0;
            this.setAuthorized(false);

            if (this.interval) {
                clearInterval(this.interval);
            }

            return new JsonRpcResult({
                status: !response.data.error,
            });
        } catch (e) {
            this.setAuthorized(false);

            this.store.message.showMessage(
                strings.error.anOccurredError,
                strings.error.connectionError,
            );
        }
    }

    setCurrentTime(time: Moment) {
        this.currentTime = time;
    }

    setAuthorized(value: boolean) {
        this.isAuthorized = value;
    }

    setCheckedAfterStart(value: boolean) {
        this.checkedAfterStart = value;
    }

    setUserLogin(value: string) {
        this.userLogin = value;
    }

    setUserName(value: string) {
        this.userName = value;
    }
}
