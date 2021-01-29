export enum AuthEventType {
    Logout = "logout",
    UpdateToken = "updateToken",
    FailedVerifyToken = "failedVerifyToken",
    FailedRenewToken = "failedRenewToken",
    TokenNotFound = "tokenNotFound",
}
