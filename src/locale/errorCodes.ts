export const authErrorCodes = new Map<string, string>()
    .set("-2001", "authenticateUserNotFound")
    .set("-2002", "authenticateUserNotActive")
    .set("-2003", "authenticateUserExpired")
    .set("-2004", "authenticateBadPassword")
    .set("-2000", "unexpectedError");
