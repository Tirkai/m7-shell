export enum AuthEventType {
    Logout = "logout",
    UpdateToken = "updateToken",
    SuccessVerifyToken = "successVerifyToken",
    FailedVerifyToken = "failedVerifyToken",
    FailedRenewToken = "failedRenewToken",
    TokenNotFound = "tokenNotFound",
}
