const nodeEnv = process.env.NODE_ENV;

const developmentDomain = "algonttest";

const [, upperLevelDomain] = window.location.hostname.split(".");

export const UPPER_LEVEL_DOMAIN =
    nodeEnv === "development" ? developmentDomain : upperLevelDomain;
