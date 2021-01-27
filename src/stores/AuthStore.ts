import { ShellMessageType } from "@algont/m7-shell-emitter";
import { JsonRpcPayload, JsonRpcResult } from "@algont/m7-utils";
import Axios from "axios";
import { AUTH_TOKEN_HEADER } from "constants/config";
import { AccessTokenVerifyStatus } from "enum/AccessTokenVerifyStatus";
import { RoleType } from "enum/RoleType";
import { ShellEvents } from "enum/ShellEvents";
import { IAccessTokenMetadata } from "interfaces/auth/IAccessTokenMetadata";
import { IRefreshTokenMetadata } from "interfaces/auth/IRefreshTokenMetadata";
import { IAuthResponse } from "interfaces/response/IAuthResponse";
import { IJsonRpcResponse } from "interfaces/response/IJsonRpcResponse";
import { Base64 } from "js-base64";
import { strings } from "locale";
import { makeAutoObservable } from "mobx";
import { ApplicationProcess } from "models/ApplicationProcess";
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

    get isAdmin() {
        return this.roles.some((item) => item === RoleType.Admin);
    }

    get isSysadmin() {
        return this.roles.some((item) => item === RoleType.Sysadmin);
    }

    decodeToken<T>(token: string) {
        const [, tokenPayload] = token.split(".");

        if (tokenPayload) {
            const decodedData = (JSON.parse(
                Base64.decode(tokenPayload),
            ) as unknown) as T;
            return decodedData;
        } else {
            return null;
        }
    }

    get remainingTokenTime() {
        const time = -this.currentTime.diff(this.renewTime) + this.deltaTime;
        return !isNaN(time) ? time : 0;
    }

    get remainingTokenTimeInSeconds() {
        return Math.floor((this.remainingTokenTime + this.timeOffset) / 1000);
    }

    get isTokenExpired() {
        return this.remainingTokenTime <= 0;
    }

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);

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
            this.setCurrentTime(moment());
            if (this.isAuthorized) {
                const hasRemainedTime = checkoutRemainingTime();
                if (!hasRemainedTime) {
                    this.renewToken();
                }
            }
        }, 1000);

        this.verifyToken();
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

        if (!response.data.error) {
            this.setCheckedAfterStart(true);
        }

        return new JsonRpcResult({
            status: !response.data.error,
            result: response.data.result === AccessTokenVerifyStatus.Ok,
        });
    }

    setToken(accessToken: string, refreshToken: string) {
        try {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;

            const refreshTokenData = this.decodeToken<IRefreshTokenMetadata>(
                refreshToken,
            );

            const accessTokenData = this.decodeToken<IAccessTokenMetadata>(
                accessToken,
            );

            this.roles = accessTokenData?.roles ?? [];

            this.createTime = moment.utc(refreshTokenData?.created);
            this.renewTime = moment.utc(refreshTokenData?.renew);

            const localStorageDelta = localStorage.getItem(
                this.localStorageDelta,
            );

            if (!localStorageDelta) {
                this.deltaTime = this.currentTime.diff(this.createTime);
                localStorage.setItem(
                    this.localStorageDelta,
                    this.deltaTime.toString(),
                );
            } else {
                this.deltaTime = parseInt(localStorageDelta);
            }

            localStorage.setItem(
                this.localStorageAccessTokenKey,
                this.accessToken,
            );

            localStorage.setItem(
                this.localStorageRefreshTokenKey,
                this.refreshToken,
            );
            Axios.defaults.headers.common[AUTH_TOKEN_HEADER] = this.accessToken;
        } catch (e) {
            console.error(e);
        }
    }

    injectAuthTokenInProcess(appProccess: ApplicationProcess) {
        try {
            appProccess.emitter.emit(ShellMessageType.UpdateAuthToken, {
                token: this.accessToken,
                login: this.userLogin,
            });
        } catch (e) {
            console.error(e);
        }
    }

    async renewToken() {
        try {
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

                this.store.processManager.processes.forEach((appProcess) =>
                    this.injectAuthTokenInProcess(appProcess),
                );
                // this.store.applicationManager.executedApplications.forEach(
                //     (item) => {
                //         if (item instanceof ExternalApplication) {
                //             item.emitter.emit(
                //                 ShellMessageType.UpdateAuthToken,
                //                 {
                //                     token: this.accessToken,
                //                     login: this.userLogin,
                //                 },
                //             );
                //         }
                //     },
                // );
            } else {
                this.logout();
            }
        } catch (e) {
            console.error(e);
        }
    }

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

                this.setUserLogin(login);
                this.setAuthorized(true);
                this.setCheckedAfterStart(true);

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

    async fetchUsername() {
        try {
            const userNameResponse = await Axios.post<
                IJsonRpcResponse<{ name: string }>
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
        try {
            const response = await Axios.post<IJsonRpcResponse<unknown>>(
                authEndpoint.url,
                new JsonRpcPayload("logout", {
                    token: this.accessToken,
                }),
            );

            dispatchEvent(new CustomEvent(ShellEvents.Logout));

            this.store.windowManager.closeAllWindows();

            this.store.processManager.killAllProcesses();

            localStorage.removeItem(this.localStorageAccessTokenKey);
            this.accessToken = "";
            this.setAuthorized(false);

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
